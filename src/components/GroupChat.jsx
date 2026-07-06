import React, { useContext, useState, useEffect } from "react";
import MessagesGroup from "./messagesGroup.jsx";
import InputMessage from "./InputMessage.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import { SocketContext } from "../context/socketContext.jsx";
import { Button } from "@chakra-ui/react";
import { DialogAddMember } from "./DialogAddMember.jsx";
import { DialogDeleteGroup } from "./DialogDeleteGroup.jsx";
import { API_URL } from "../config.js";

const GroupChat = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [leaving, setLeaving] = useState(false);
    const { user, token } = useContext(UserContext);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const handleLeave = async () => {
        if (!window.confirm("¿Estás seguro de que querés salir del grupo?")) return;
        setLeaving(true);
        try {
            const res = await fetch(`${API_URL}group/leave/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "currentUser": token
                }
            });
            if (!res.ok) throw new Error("Error al salir");
            socket.emit('updateusers');
            navigate('/');
        } catch (err) {
            alert(err.message);
        } finally {
            setLeaving(false);
        }
    };

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
                <p>
                    Group members: 
                    {group ?
                        group.users.map((user, index) => (
                            <span key={index}>
                                {user.user.username}
                                {index < group.users.length - 1 ? ', ' : '.'}
                            </span>
                        )): 'Loading...'}
                </p>
                <div className="admin-controls">
                    {group && user && group?.useradmin._id === user.id && (
                        <>
                            <DialogAddMember idGroup={id} />
                            <DialogDeleteGroup idGroup={id} groupName={group?.name} />
                        </>
                    )}
                    {group && user && (
                        <Button size="sm" onClick={handleLeave} loading={leaving} colorScheme="red" variant="ghost">
                            Salir del grupo
                        </Button>
                    )}
                </div>
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