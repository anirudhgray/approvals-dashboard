import React from 'react'
import RequestItem from '../admin/RequestItem'

export default function RequestList({requests, title}) {
  return (
    <div className='mt-5'>
        <h2 className='text-xl mb-4'>{title}</h2>
        {requests?.length ? requests.map((request) => {
            return(
                <RequestItem date={request.createdAt} key={request._id} description={request.description} name={request.createdBy.name} email={request.createdBy.email} workflow={request.workflowType.name} status={request.status} approvedBy={request.approvedBy} approvalLevel={request.workflowType.approvalLevel} rejectedBy={request.rejectedBy} />
            )
        }) : <p className='text-sm'>None.</p>}
    </div>
  )
}
