import { Tabs, Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import CreateNewWorkflow from '../components/admin/CreateNewWorkflow';
import axios from '../../axios'
import RequestHistory from '../components/admin/RequestHistory';
import Dashboard from '../components/admin/Dashboard';
import Footer from '../components/Footer';
import { logout } from '../utils/logout';
import { datesort } from '../utils/datesort';

export default function Admin() {
    const [activeTab, setActiveTab] = useState('create')
    const [approvers, setApprovers] = useState([])
    const [requests, setRequests] = useState([])

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/api/request/data-stream');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // console.log(data)
            setRequests(datesort(data))
            // Handle the received data, e.g., update the UI
        };
    },[])

    useEffect(() => {
        setRequests(requests)
    }, [requests])

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
                console.log(datesort(res.data))
                setRequests(datesort(res.data))
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
