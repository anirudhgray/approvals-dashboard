import React from 'react'
import RequestItem from './RequestItem'
import dayjs from 'dayjs'

export default function RequestHistory({requests}) {
  return (
    <div className='mt-5'>
        <h2 className='text-xl mb-4'>Full Request History</h2>
        {requests.map((request) => {
            return(
                <RequestItem date={request.createdAt} key={request._id} description={request.description} name={request.createdBy.name} email={request.createdBy.email} workflow={request.workflowType.name} status={request.status} />
            )
        })}
    </div>
  )
}
