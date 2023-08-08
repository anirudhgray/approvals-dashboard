import { Response } from "express";
import Request from "../models/request.model";
import IWorkflow from "../interfaces/workflow";
import Log from "../middlewares/Log";
import User from "../models/user.model";
import { GetUserInfoRequest } from "../interfaces/request";
import Workflow from "../models/workflow.model";


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
     
}

export default ManageRequest;
