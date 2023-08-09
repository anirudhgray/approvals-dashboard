import React, { useEffect, useState } from 'react'
import { Button, Tabs } from '@mantine/core'
import { logout } from '../utils/logout'
import Footer from '../components/Footer'
import axios from '../../axios'
import { toast } from 'react-toastify'
import CreateRequest from '../components/requester/CreateRequest'
import RequestList from '../components/requester/RequestList'
import JustificationList from '../components/requester/JustificationList'
import { datesort } from '../utils/datesort'

export default function Requester() {
    const [activeTab, setActiveTab] = useState("create")
    const [workflowsList, setWorkflowsList] = useState([])
    const [pending, setPending] = useState([])
    const [accepted, setAccepted] = useState([])
    const [rejected, setRejected] = useState([])
    const [justificationNeeded, setJustificationNeeded] = useState([])

    useEffect(() => {
        const getWorkflows = async () => {
            try {
                const res = await axios.get("/api/workflow", {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                const arr = res.data.map(({_id, name, ...rest}) => ({...rest, value:_id, label: name}))
                setWorkflowsList(arr)
            } catch (e) {
                console.log(e)
                toast.error(e?.response?.data)
            }
        }
        const getRequests = async () => {
            try {
                let res = await axios.get("/api/request/me",{
                    params: {
                        status: 0
                    },
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                setPending(datesort(res.data))
                res = await axios.get("/api/request/me", {
                    params: {
                        status: 1
                    },
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                setAccepted(datesort(res.data))
                res = await axios.get("/api/request/me",{
                    params: {
                        status: 2
                    },
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                setRejected(datesort(res.data))
                res = await axios.get("/api/request/me",{
                    params: {
                        status: 3
                    },
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                setJustificationNeeded(datesort(res.data))
            } catch (e) {
                console.log(e)
                toast.error(e?.response?.data)
            }
        }
        getWorkflows()
        getRequests()
    },[])
    return (
        <>
            <div className='m-10 relative'>
                <h1 className='font-bold'>APPROVAGANZA</h1>
                <Button onClick={logout} variant='light' color='red' className="absolute top-0 right-0">Logout</Button>
                <h1>Requester</h1>
                <p>Welcome, {localStorage.getItem("name")}.</p>
                <Tabs className='mt-5' value={activeTab} onTabChange={setActiveTab}>
                    <Tabs.List>
                        <Tabs.Tab value="create">New Request</Tabs.Tab>
                        <Tabs.Tab value="pending">Pending</Tabs.Tab>
                        <Tabs.Tab value="justification">Justification Needed</Tabs.Tab>
                        <Tabs.Tab value="accepted">Accepted</Tabs.Tab>
                        <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="create" pt="xs">
                        <CreateRequest workflowsList={workflowsList} />
                    </Tabs.Panel>

                    <Tabs.Panel value="pending" pt="xs">
                        <RequestList title={"Pending Requests"} requests={pending} />
                    </Tabs.Panel>

                    <Tabs.Panel value="justification" pt="xs">
                        <JustificationList title={"Justification Needed"} requests={justificationNeeded} />
                    </Tabs.Panel>

                    <Tabs.Panel value="accepted" pt="xs">
                        <RequestList title={"Accepted Requests"} requests={accepted} />
                    </Tabs.Panel>

                    <Tabs.Panel value="rejected" pt="xs">
                        <RequestList title={"Rejected Requests"} requests={rejected} />
                    </Tabs.Panel>
                </Tabs>
            </div>
            <Footer />
        </>
    )
}
