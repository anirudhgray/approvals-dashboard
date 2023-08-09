import { Badge, Button } from '@mantine/core'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import axios from '../../../axios'
import { toast } from 'react-toastify'

export default function ApprovalItem({name, email, workflow, description, status, date, approvedBy, approvalLevel, reqid}) {
    const [loading, setLoading] = useState(false)
    const patchStatus = async (newStatus) => {
        setLoading(true)
        try {
            await axios.patch(`/api/request/approval/${reqid}`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            toast.success("Status Changed!")
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        } catch (e) {
            console.log(e)
            toast.error("Error.")
        }
        setLoading(false)
    }
  return (
    <div className='hover:bg-slate-800 rounded-lg p-2 px-3'>
        <p className='text-lg'>{description}</p>
        <p className='text-sm'>Submitted by: {name} ({email})</p>
        <p>Under workflow: <span className='font-bold'>{workflow}</span></p>
        <p>On: <span className='font-bold'>{dayjs(date).format('DD/MM/YYYY HH:mm')}</span></p>
        <p>Approved By: {approvedBy.length ? 
                approvedBy.map((ap) => (<span>{ap.email} </span>)) : <span>None.</span>
            } (needs: {approvalLevel === 0 ? "1" : approvalLevel ===1 ? "2" : "All"} approvals)</p>
        <Badge color={status === 0 ? "blue" : status === 1 ? "green" : status === 2 ? "red" : "yellow"} className='text-sm'>{status === 0 ? "Pending" : status === 1 ? "Accepted" : status === 2 ? "Rejected" : "Justification Needed"}</Badge>
        <div className='flex mt-1 items-center'>
            <Button onClick={() => patchStatus(1)} variant='light' color='green'>Accept</Button>
            <Button onClick={() => patchStatus(2)} variant='light' color='red'>Reject</Button>
            <Button onClick={() => patchStatus(3)} variant='light' color='yellow'>Justification Needed</Button>
            {loading ? <p className='ml-2 text-sm'>Working...</p> : null}
        </div>
    </div>
  )
}
