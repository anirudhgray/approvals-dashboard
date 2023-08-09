import { NativeSelect, Button, Textarea, Loader } from '@mantine/core'
import { useEffect, useState } from 'react'
import axios from '../../../axios'
import { toast } from 'react-toastify'

export default function CreateRequest({workflowsList}) {
    const [description, setDescription] = useState("")
    const [workflow, setWorkflow] = useState("")
    const [selectedDesc, setSelectedDesc] = useState("")
    const [loading, setLoading] = useState("")

    useEffect(() => {
        const selected = workflowsList.filter(flow => {
            return flow.value === workflow
        })
        setSelectedDesc(selected[0]?.description)
        console.log("ok")
    }, [workflow])

    const createRequest = async () => {
        setLoading(true)
        try {
            await axios.post("/api/request", {
                workflowType: workflow,
                description
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            toast.success("Request Made!")
        } catch (e) {
            console.log(e)
            toast.error(`Error`)
        }
        setLoading(false)
    }
    return (
        <form onSubmit={e=>{e.preventDefault();createRequest()}} className='mt-5 flex flex-col gap-2 md:w-7/12 w-full'>
            <h2 className='text-xl mb-4'>Make a Request</h2>
            <NativeSelect defaultValue={"Select"} required data={workflowsList} value={workflow} label="Select Workflow" onChange={(e) => setWorkflow(e.currentTarget.value)} />
            <p className='text-sm'>{selectedDesc && `Workflow Description: ${selectedDesc}`}</p>
            <Textarea required value={description} onChange={e => setDescription(e.currentTarget.value)} label="Description" placeholder='Why are you making this request?' />
            <Button type='submit' variant='outline' fullWidth mt="xl" size="md">
                {loading ? <Loader /> :"Create"}
            </Button>
        </form>
    )
}
