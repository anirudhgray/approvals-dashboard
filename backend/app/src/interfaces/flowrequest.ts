import { Types } from "mongoose";

interface IRequest {
    _id: string;
    createdBy: Types.ObjectId;
    workflowType: Types.ObjectId;
    description: string;
    status: number; // 0 pending, 1 accepted, 2 rejected, 3 justification
    approvedBy: [Types.ObjectId | null]
}

export default IRequest;
