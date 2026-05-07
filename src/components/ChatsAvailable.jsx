import { UserContext } from "../context/userContext.jsx";
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { LastMessage } from "./lastMessage.jsx";
export const ChatsAvailable = () => {
    const { user } = useContext(UserContext);
    const [groups, setGroups] = useState([]);
    useEffect(()=>{
        if(user) {
            setGroups(user.groups);
        } else {
            setGroups([]);
        }
    },[user])
    return (
        <>
        {groups.map((group)=> (
            <div key={group._id} className="individual-chat">
                <Link to={`/chat/${group._id}`}>
                    <h3>{group.name}</h3>
                    <LastMessage id={group._id.toString()}/>
                </Link>
            </div>
        ))}
        </>
    )
}