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
        description
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
        reqsByUser = await Request.find({createdBy, status: req.query.status}).populate(['createdBy','workflowType']).exec();
      } else {
        reqsByUser = await Request.find({createdBy}).populate(['createdBy','workflowType']).exec();
      }
      return res.status(201).json(
        reqsByUser
      );
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }

  public static async getAllRequests(req: GetUserInfoRequest, res: Response): Promise<Response | void> {
    try {
      const reqs = await Request.find().populate(['createdBy','workflowType']).exec();
      return res.status(201).json(
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
      const filter = { age: { $gte: 30 } };
      const workflows = await Workflow.find({approvers: approverId});
      const workflowIds = workflows.map(doc => doc._id);

      let reqsForApproval;

      if (req.query.status) {
        reqsForApproval = await Request.find({ workflowType: { $in: workflowIds }, status: req.query.status });
      } else {
        reqsForApproval = await Request.find({ workflowType: { $in: workflowIds } });
      }
      return res.status(201).json(
        reqsForApproval
      );
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }

  // TODO add support for workflows needing at least 2/more for approval.
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

      request.status = status;
      request.save();

      const subject = "An update on your request.";
      // const html = `<a href="http://${req.get('host')}/verify/${newUser._id}/${hash}">Verify your email</a>`;
      const html = `<div><p>New Status: ${request.status == 1 ? "Accepted" : request.status == 2 ? "Rejected" : "Pending/Justification Needed"}</p><p>Your Request Description: ${request.description}</p></div>`;
      await sendEmail(requester.email, subject, html);

      return res.status(201).json(
        request
      );
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
}

export default ManageRequest;
