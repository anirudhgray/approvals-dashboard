import React from 'react'
import WorkflowItem from './WorkflowItem'

export default function AssignedWorkflows({workflows}) {
  return (
    <div className='mt-5'>
        <h2 className='text-xl mb-4'>Workflows Assigned To You</h2>
        {workflows.map((workflow) => {
            return(
                <WorkflowItem key={workflow._id} description={workflow.description} name={workflow.name} createdBy={workflow.createdBy.email} approvers={workflow.approvers} approvalLevel={workflow.approvalLevel} />
            )
        })}
    </div>
  )
}
