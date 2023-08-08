import { Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import CreateNewWorkflow from '../components/CreateNewWorkflow';
import axios from '../../axios'

export default function Admin() {
    const [activeTab, setActiveTab] = useState('create')
    const [approvers, setApprovers] = useState([])

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
            getApprovers()
        } catch (e) {
            console.log(e)
        }
    }, [])
    return (
        <div className='p-10'>
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
                    Messages tab content
                </Tabs.Panel>

                <Tabs.Panel value="history" pt="xs">
                    Settings tab content
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}
