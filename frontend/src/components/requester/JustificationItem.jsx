import { Badge, Textarea, Button, Loader } from '@mantine/core'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import axios from '../../../axios'
import { toast } from 'react-toastify'

export default function JustificationItem({name, email, workflow, description, status, date, approvedBy, approvalLevel, rejectedBy, reqid}) {
    const [newdesc, setNewdesc] = useState(description)
    const [loading, setLoading] = useState(false)

    const patchJustification = async () => {
        setLoading(true)
        try {
            const res = await axios.patch(`/api/request/me/${reqid}`, {
                description: newdesc
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            toast.success("Patched!")
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
        {status===2 ? <p>Rejected By: {rejectedBy?.email}</p> : (
            <p>Approved By: {approvedBy.length ? 
                approvedBy.map((ap) => (<span>{ap.email} </span>)) : <span>None.</span>
            } (needs: {approvalLevel === 0 ? "1" : approvalLevel ===1 ? "2" : "All"} approvals)</p>
        )}
        <Badge color={status === 0 ? "blue" : status === 1 ? "green" : status === 2 ? "red" : "yellow"} className='text-sm'>{status === 0 ? "Pending" : status === 1 ? "Accepted" : status === 2 ? "Rejected" : "Justification Needed"}</Badge>
        <Textarea onChange={e => setNewdesc(e.currentTarget.value)} className='mt-2' label={"Edit your request with further justification."} value={newdesc} />
        <Button onClick={patchJustification} className='mt-2' variant='light'>{loading ? <Loader /> : "Submit Justification"}</Button>
    </div>
  )
}
