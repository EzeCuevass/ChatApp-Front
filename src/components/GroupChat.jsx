import React from "react";
import MessagesGroup from "./messagesGroup.jsx";
import InputMessage from "./InputMessage.jsx";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext.jsx";
import { Button } from "@chakra-ui/react";
import { DialogAddMember } from "./DialogAddMember.jsx";
import { DialogDeleteGroup } from "./DialogDeleteGroup.jsx";
const GroupChat = () => {
    // Group chat component
    // Displays the group chat header, messages, and input field
    const { id } = useParams();
    // id is the group ID from the URL parameters
    // Uses the group state to store the group data
    const [group, setGroup] = useState(null);
    // Uses the UserContext to get the current user data
        // Email, fullname, groups, id, photo, username
    const { user } = useContext(UserContext);
    useEffect(() => {
        if (!user || !user.groups) {
            setGroup(null);
            return;
        }
        const groupdata = user.groups.find(group => group._id === id);
        setGroup(groupdata);
    }, [id, user]);
    return(
        <div className="chat">
                <div className="chat-header">
                    <h1>{group ? group.name : 'Loading...'}</h1>
                     {group && user && group?.useradmin._id == user.id
                     ? <div className="admin-controls">
                        <DialogAddMember idGroup={id} />
                        <DialogDeleteGroup idGroup={id} groupName={group?.name} />
                     </div> : null}
                </div>
                <div className="chat-messages">
                    <MessagesGroup id={id}/>
                </div>
                <div className="chat-input">
                    <div className="input-container">
                        <InputMessage idGroup={id}/>
                    </div>
                </div>
            </div>
    )
}
export default GroupChat;