import { Badge } from '@mantine/core'
import React from 'react'
import dayjs from 'dayjs'

export default function WorkflowItem({name, createdBy, description, approvers, approvalLevel}) {
  return (
    <div className='hover:bg-slate-800 rounded-lg p-2 px-3'>
        <p className='text-lg'>{name}</p>
        <p>{description}</p>
        <p className='text-sm'>Workflow created by admin: {createdBy}</p>
        <p>Assigned to: {approvers.length ? 
                approvers.map((ap) => (<span>{ap.email} </span>)) : <span>None.</span>
            } (needs: {approvalLevel === 0 ? "1" : approvalLevel ===1 ? "2" : "All"} approvals)</p>
    </div>
  )
}
