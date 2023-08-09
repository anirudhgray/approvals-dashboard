import { Tabs, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import CreateNewWorkflow from '../components/admin/CreateNewWorkflow';
import axios from '../../axios'
import RequestHistory from '../components/admin/RequestHistory';
import Dashboard from '../components/admin/Dashboard';
import Footer from '../components/Footer';
import { logout } from '../utils/logout';

export default function Admin() {
    const [activeTab, setActiveTab] = useState('create')
    const [approvers, setApprovers] = useState([])
    const [requests, setRequests] = useState([])

    useEffect(() => {
        try {
            const getApprovers = async () => {
                const res = await axios.get("/api/approvers", {
                    headers:{
                        Authorization: localStorage.getItem("token")
                    }
                })
                const arr = res.data.map(({_id, email, ...rest}) => ({...rest, value:_id, label: email}))
                setApprovers(arr)
            }
            const getRequests = async () => {
                const res = await axios.get("/api/request", {
                    headers:{
                        Authorization: localStorage.getItem("token")
                    }
                })
                setRequests(res.data)
            }
            getApprovers()
            getRequests()
        } catch (e) {
            console.log(e)
        }
    }, [])
    return (
        <>
        <div className='m-10 relative'>
            <h1 className='font-bold'>APPROVAGANZA</h1>
            <Button onClick={logout} variant='light' color='red' className="absolute top-0 right-0">Logout</Button>
            <h1>Admin</h1>
            <p>Welcome, {localStorage.getItem("name")}.</p>
            <Tabs className='mt-5' value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="create">New Workflow</Tabs.Tab>
                    <Tabs.Tab value="dashboard">Dashboard</Tabs.Tab>
                    <Tabs.Tab value="history">History</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="create" pt="xs">
                    <CreateNewWorkflow approvers={approvers} />
                </Tabs.Panel>

                <Tabs.Panel value="dashboard" pt="xs">
                    <Dashboard />
                </Tabs.Panel>

                <Tabs.Panel value="history" pt="xs">
                    <RequestHistory requests={requests} />
                </Tabs.Panel>
            </Tabs>
        </div>
        <Footer/>
        </>
    )
}
