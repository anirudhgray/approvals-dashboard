import { Types } from "mongoose";

interface IWorkflow {
    _id: string;
    name: string;
    createdBy: Types.ObjectId;
    approvalLevel: number; // 0, anyone can approve. 1, at least 2 should. 2, all needed.
    description: string;
    approvers: [Types.ObjectId];
}

export default IWorkflow;
