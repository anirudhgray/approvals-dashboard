import { NativeSelect, TextInput, Button, Textarea, MultiSelect } from '@mantine/core'
import { useState } from 'react'
import axios from '../../axios'
import { toast } from 'react-toastify'

export default function CreateNewWorkflow({approvers}) {
    const [name, setName] = useState("")
    const [approvalLevel, setApprovalLevel] = useState(0)
    const [approversList, setApprovers] = useState([])
    const [description, setDescription] = useState("")

    const createWorkflow = async () => {
        try {
            await axios.post("/api/workflow", {
                name,
                approvalLevel,
                approvers:approversList,
                description
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            toast.success("Workflow Created!")
        } catch (e) {
            console.log(e)
            toast.error(e?.response?.data)
        }
    }
    return (
        <form onSubmit={e=>{e.preventDefault();createWorkflow()}} className='mt-5 flex flex-col gap-2 md:w-7/12 w-full'>
            <h2 className='text-xl mb-4'>Create a new workflow</h2>
            <TextInput required value={name} onChange={(e) => setName(e.currentTarget.value)} label="Name of Workflow" placeholder='Reimbursement, Leave, etc.' />
            <NativeSelect required data={[{
                value:0,
                label:"Single Approval Needed"
            },
            {
                value:1,
                label:"Two Approvals Needed"
            },
            {
                value:2,
                label:"All Assigned Approvers need to Approve."
            }]} value={approvalLevel} label="Approval Level" onChange={e => setApprovalLevel(e.currentTarget.value)} />
            <MultiSelect required data={approvers} value={approversList} label="Assign People for Approving" onChange={setApprovers} />
            <Textarea required value={description} onChange={e => setDescription(e.currentTarget.value)} label="Description" placeholder='Must apply at least 3 days in advance.' />
            <Button type='submit' variant='outline' fullWidth mt="xl" size="md">
                Create
            </Button>
        </form>
    )
}
