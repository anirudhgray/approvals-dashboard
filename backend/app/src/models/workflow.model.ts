import mongoose from "../providers/Database";
import IWorkflow from "../interfaces/workflow";

export const WorkflowSchema = new mongoose.Schema<IWorkflow>({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  approvalLevel: {type: Number, required: true},
  approvers: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}],
  description: {type: String, required: true}
}, {
  timestamps: true
});

const Workflow = mongoose.model<IWorkflow>("Workflow", WorkflowSchema);

export default Workflow;
