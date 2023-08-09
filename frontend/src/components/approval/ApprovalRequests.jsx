import React from 'react'
import ApprovalItem from './ApporvalItem'

export default function ApprovalRequests({requests}) {
  return (
    <div className='mt-5'>
        <h2 className='text-xl mb-4'>Requests Needing Your Attention</h2>
        {requests.map((request) => {
            return(
                <ApprovalItem date={request.createdAt} key={request._id} description={request.description} name={request.createdBy.name} email={request.createdBy.email} workflow={request.workflowType.name} status={request.status} approvedBy={request.approvedBy} approvalLevel={request.workflowType.approvalLevel} reqid={request._id} />
            )
        })}
    </div>
  )
}
