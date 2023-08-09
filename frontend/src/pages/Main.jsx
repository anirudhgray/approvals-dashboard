import React from 'react'
import Admin from './Admin'
import Requester from './Requester'
import Approval from './Approval'

export default function Main() {
    if (localStorage.getItem("role")===0 || localStorage.getItem("role")==="0") {
        return (
            <Admin />
        )
    } else if (localStorage.getItem("role")===1 || localStorage.getItem("role")==="1") {
        return (
            <Approval />
        )
    } else if (localStorage.getItem("role")===2 || localStorage.getItem("role")==="2") {
        return (
            <Requester />
        )
    } else {
        return (
            <div>Weird.</div>
        )
    }
}
