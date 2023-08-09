import { Badge } from '@mantine/core'
import React from 'react'
import dayjs from 'dayjs'

export default function RequestItem({name, email, workflow, description, status, date, approvedBy, approvalLevel, rejectedBy}) {
  return (
    <div className='hover:bg-slate-800 rounded-lg p-2 px-3'>
        <p className='text-lg'>{description}</p>
        <p className='text-sm'>Submitted by: {name} ({email})</p>
        <p>Under workflow: <span className='font-bold'>{workflow}</span></p>
        <p>On: <span className='font-bold'>{dayjs(date).format('DD/MM/YYYY HH:mm')}</span></p>
        {status===2 ? <p>Rejected By: {rejectedBy?.email}</p> : (
            <p>Approved By: {approvedBy.length ? 
                approvedBy.map((ap) => (<span>{ap.email} </span>)) : <span>None.</span>
            } (needs: {approvalLevel === 0 ? "1" : approvalLevel ===1 ? "2" : "All"} approvals)</p>
        )}
        <Badge color={status === 0 ? "blue" : status === 1 ? "green" : status === 2 ? "red" : "yellow"} className='text-sm'>{status === 0 ? "Pending" : status === 1 ? "Accepted" : status === 2 ? "Rejected" : "Justification Needed"}</Badge>
    </div>
  )
}
