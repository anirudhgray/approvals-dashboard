import { Response } from "express";
import Request from "../models/request.model";
import IWorkflow from "../interfaces/workflow";
import Log from "../middlewares/Log";
import User from "../models/user.model";
import { GetUserInfoRequest } from "../interfaces/request";
import Workflow from "../models/workflow.model";
import { sendEmail } from "../services/sendEmail";

class ManageRequest {

  public static async create(req: GetUserInfoRequest, res: Response): Promise<Response | void> {
    try {
      const { approvalLevel, workflowType, description } = req.body;
      const flow: IWorkflow = await Workflow.findById(workflowType);
      if (!flow) {
        return res.status(400).send("Invalid workflow.");
      }
      const requester = await User.findById(req.userId);
      const createdBy = requester._id;
      const newReq = new Request({
        createdBy,
        approvalLevel, 
        workflowType,
        description,
      });
      newReq.status = 0; // active/pending req

      const approvers = flow.approvers;
      for (let i = 0; i<approvers.length; i++) {
        const ap = await User.findById(approvers[i]);
        const subject = "A new request awaiting approval.";
        const html = `<div><p>Request Description: ${newReq.description}</p><p>Workflow: ${flow.name}</p></div>`;
        await sendEmail(ap.email, subject, html);
      }
      await newReq.save();
      return res.status(201).json({
        newReq
      });
      // return res.status(500).send("Lol");
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }

  public static async getRequesterRequests(req: GetUserInfoRequest, res: Response): Promise<Response | void> {
    try {
      const requester = await User.findById(req.userId);
      const createdBy = requester._id;
      let reqsByUser;
      if (req.query.status) {
        reqsByUser = await Request.find({createdBy, status: req.query.status}).populate(['createdBy','workflowType','approvedBy','rejectedBy']).exec();
      } else {
        reqsByUser = await Request.find({createdBy}).populate(['createdBy','workflowType','approvedBy','rejectedBy']).exec();
      }
      return res.status(200).json(
        reqsByUser
      );
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }

  public static async getAllRequests(req: GetUserInfoRequest, res: Response): Promise<Response | void> {
    try {
      const reqs = await Request.find().populate(['createdBy','workflowType','approvedBy','rejectedBy']).exec();
      return res.status(200).json(
        reqs
      );
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
  
  public static async getRequestsForApproval(req: GetUserInfoRequest, res: Response): Promise<Response | void> {
    try {
      const approver = await User.findById(req.userId);
      const approverId = approver._id;
      const workflows = await Workflow.find({approvers: approverId});
      const workflowIds = workflows.map(doc => doc._id);

      let reqsForApproval;

      if (req.query.status) {
        reqsForApproval = await Request.find({ workflowType: { $in: workflowIds }, approvedBy: {$ne: approverId}, status: req.query.status }).populate(['approvedBy','createdBy','workflowType']).exec();
      } else {
        reqsForApproval = await Request.find({ workflowType: { $in: workflowIds } }).populate(['approvedBy','createdBy','workflowType']).exec();
      }
      return res.status(200).json(
        reqsForApproval
      );
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }

  public static async patchRequestStatus(req: GetUserInfoRequest, res: Response): Promise<Response | void> {
    try {
      const requestId = req.params.id;
      const { status } = req.body;
      const approver = await User.findById(req.userId);
      const approverId = approver._id;
      const request = await Request.findById(requestId);
      const workflow = await Workflow.findById(request.workflowType);
      if (!workflow.approvers.includes(approverId)) {
        return res.status(400).send("You can't approve this one. Not assigned to you.");
      }
      const requester = await User.findById(request.createdBy);

      if (status === 1) {
        if (request.approvedBy?.length) {
          request.approvedBy.push(approverId);
        } else {
          request.approvedBy = [approverId];
        }
      } else if (status ===2) {
        request.approvedBy = null;
      }


      // single approval needed
      if (workflow.approvalLevel === 0 || status !== 1) {
        request.status = status;
        if (status===2) {
          request.rejectedBy = approver._id;
        }
        request.save();

        const subject = "An update on your request.";
        // const html = `<a href="http://${req.get('host')}/verify/${newUser._id}/${hash}">Verify your email</a>`;
        const html = `<div><p>New Status: ${request.status === 1 ? "Accepted" : request.status === 2 ? "Rejected" : "Pending/Justification Needed"}</p><p>Your Request Description: ${request.description}</p></div>`;
        await sendEmail(requester.email, subject, html);

        return res.status(200).json(
          request
        );
      } 
      // 2 or more approvals needed
      else if (workflow.approvalLevel === 1 && request.approvedBy.length>=2) {
        request.status = status;
        request.save();

        const subject = "An update on your request.";
        // const html = `<a href="http://${req.get('host')}/verify/${newUser._id}/${hash}">Verify your email</a>`;
        const html = `<div><p>New Status: ${request.status === 1 ? "Accepted" : request.status === 2 ? "Rejected" : "Pending/Justification Needed"}</p><p>Your Request Description: ${request.description}</p></div>`;
        await sendEmail(requester.email, subject, html);

        return res.status(200).json(
          request
        );
      }
      // all approvals needed
      else if (workflow.approvalLevel === 2 && request.approvedBy.length==workflow.approvers.length) {
        request.status = status;
        request.save();

        const subject = "An update on your request.";
        // const html = `<a href="http://${req.get('host')}/verify/${newUser._id}/${hash}">Verify your email</a>`;
        const html = `<div><p>New Status: ${request.status === 1 ? "Accepted" : request.status === 2 ? "Rejected" : "Pending/Justification Needed"}</p><p>Your Request Description: ${request.description}</p></div>`;
        await sendEmail(requester.email, subject, html);

        return res.status(200).json(
          request
        );
      }

      request.save();
      return res.status(200).json(
        request
      );

    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }

  public static async patchRequestDescription(req: GetUserInfoRequest, res: Response): Promise<Response | void> {
    try {
      const requestId = req.params.id;
      const { description } = req.body;
      const requester = await User.findById(req.userId);
      const requesterId = requester._id;
      const request = await Request.findById(requestId);
      const workflow = await Workflow.findById(request.workflowType);
      if (!request.createdBy.equals(requesterId)) {
        console.log(request.createdBy, requesterId);
        return res.status(400).send("You can't update this one. Not your request.");
      }
      request.status = 0;

      request.description = description;

      const approvers = workflow.approvers;
      for (let i = 0; i<approvers.length; i++) {
        const ap = await User.findById(approvers[i]);
        const subject = "A justification for an assigned request.";
        const html = `<div><p>New Request Description: ${request.description}</p><p>Workflow: ${workflow.name}</p></div>`;
        await sendEmail(ap.email, subject, html);
      }

      request.save();

      return res.status(200).json(
        request
      );
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
}

export default ManageRequest;
