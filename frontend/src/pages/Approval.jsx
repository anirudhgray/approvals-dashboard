import { Tabs, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import CreateNewWorkflow from '../components/admin/CreateNewWorkflow';
import axios from '../../axios'
import RequestHistory from '../components/admin/RequestHistory';
import Dashboard from '../components/admin/Dashboard';
import Footer from '../components/Footer';
import { logout } from '../utils/logout';
import AssignedWorkflows from '../components/approval/AssignedWorkflows';
import ApprovalRequests from '../components/approval/ApprovalRequests';
import { datesort } from '../utils/datesort';

export default function Approval() {
    const [activeTab, setActiveTab] = useState('requests')
    const [requests, setRequests] = useState([])
    const [workflows, setWorkflows] = useState([])
 
    useEffect(() => {
        try {
            const getReqsForApproval = async () => {
                const res1 = await axios.get("/api/request/approval", {
                    params: {
                        status: 0
                    },
                    headers:{
                        Authorization: localStorage.getItem("token")
                    }
                })
                // const res2 = await axios.get("/api/request/approval", {
                //     params: {
                //         status: 3
                //     },
                //     headers:{
                //         Authorization: localStorage.getItem("token")
                //     }
                // })
                setRequests([...datesort(res1.data)])
            }
            const getAssignedWorkflows = async () => {
                const res = await axios.get("/api/approvers/workflow", {
                    headers:{
                        Authorization: localStorage.getItem("token")
                    }
                })
                setWorkflows(res.data)
            }
            getReqsForApproval()
            getAssignedWorkflows()
        } catch (e) {
            console.log(e)
        }
    }, [])
    return (
        <>
        <div className='m-10 relative'>
            <h1 className='font-bold'>APPROVAGANZA</h1>
            <Button onClick={logout} variant='light' color='red' className="absolute top-0 right-0">Logout</Button>
            <h1>Approval</h1>
            <p>Welcome, {localStorage.getItem("name")}.</p>
            <Tabs className='mt-5' value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="requests">Assigned and Pending</Tabs.Tab>
                    <Tabs.Tab value="workflows">Assigned Workflows</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="requests" pt="xs">
                    <ApprovalRequests requests={requests} />
                </Tabs.Panel>

                <Tabs.Panel value="workflows" pt="xs">
                    <AssignedWorkflows workflows={workflows} />
                </Tabs.Panel>
            </Tabs>
        </div>
        <Footer/>
        </>
    )
}
