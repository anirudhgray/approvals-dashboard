import { Router } from "express";
import Joi from "joi";
import Validate from "../middlewares/Validate";
import ManageWorkflow from "../controllers/Workflow";
import { authoriseAdmin, authoriseApprover, authoriseRequester } from "../middlewares/Authorise";

const router = Router();

// Joi validation schema
const schema = {
  createWorkflow: Joi.object({
    name: Joi.string().required(),
    approvalLevel: Joi.number().required(),
    approvers: Joi.array().required(),
    description: Joi.string().required()
  }),
};

router.post("/workflow", Validate.body(schema.createWorkflow), authoriseAdmin, ManageWorkflow.create);
router.get("/workflow", authoriseRequester, ManageWorkflow.getWorkflows);
router.get("/approvers/workflow", authoriseApprover, ManageWorkflow.getApproverWorkflows);
router.get("/approvers", authoriseAdmin, ManageWorkflow.getApprovers);


export default router;
