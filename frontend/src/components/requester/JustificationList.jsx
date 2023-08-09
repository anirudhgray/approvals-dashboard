import React from 'react'
import JustificationItem from './JustificationItem'

export default function JustificationList({requests, title}) {
  return (
    <div className='mt-5'>
        <h2 className='text-xl mb-4'>{title}</h2>
        {requests?.length ? requests.map((request) => {
            return(
                <JustificationItem date={request.createdAt} key={request._id} description={request.description} name={request.createdBy.name} email={request.createdBy.email} workflow={request.workflowType.name} status={request.status} approvedBy={request.approvedBy} approvalLevel={request.workflowType.approvalLevel} rejectedBy={request.rejectedBy} reqid={request._id} />
            )
        }) : <p className='text-sm'>None.</p>}
    </div>
  )
}
