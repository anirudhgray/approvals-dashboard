import mongoose from "../providers/Database";
import IRequest from "../interfaces/flowrequest";

export const RequestSchema = new mongoose.Schema<IRequest>({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workflowType: { type: mongoose.Schema.Types.ObjectId, ref: "Workflow", required: true},
  description: {type: String, required: true},
  status: {type: Number, required: true},
  approvedBy: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: false}],
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
}, {
  timestamps: true
});

const Request = mongoose.model<IRequest>("Request", RequestSchema);

export default Request;
