import { Response } from "express";
import { v4 } from "uuid";
import Workflow from "../models/workflow.model";
import IWorkflow from "../interfaces/workflow";
import Log from "../middlewares/Log";
import User from "../models/user.model";
import { GetUserInfoRequest } from "../interfaces/request";


class ManageWorkflow {
  // TODO edit workflows
  // TODO edit roles/perms

  public static async create(req: GetUserInfoRequest, res: Response): Promise<Response | void> {
    try {
      const { name, approvalLevel, approvers, description } = req.body;
      const flow: IWorkflow = await Workflow.findOne({ name });
      if (flow) {
        return res.status(400).send("Workflow by that name already exists");
      }
      const admin = await User.findById(req.userId);
      const createdBy = admin._id;
      const newFlow = new Workflow({
        name,
        createdBy,
        approvalLevel, 
        approvers, 
        description
      });
      await newFlow.save();
      return res.status(201).json({
        newFlow
      });
      // return res.status(500).send("Lol");
    } catch (error) {
      Log.error(error);
      return res.status(500).send("Internal server error");
    }
  }
     
}

export default ManageWorkflow;
