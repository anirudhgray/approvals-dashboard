import { Types } from "mongoose";

interface IRequest {
    _id: string;
    createdBy: Types.ObjectId;
    workflowType: Types.ObjectId;
    description: string;
    status: number;
}

export default IRequest;
