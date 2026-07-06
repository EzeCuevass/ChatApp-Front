import { UserContext } from "../context/userContext.jsx";
import { OnlineContext } from "../context/OnlineContext.jsx";
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { LastMessage } from "./lastMessage.jsx";
import { DialogStartChat } from "./DialogStartChat.jsx";
import { Avatar } from "./ui/Avatar.jsx";

export const ChatsAvailable = ({ onClose }) => {
    const { user } = useContext(UserContext);
    const onlineSet = useContext(OnlineContext);
    const [groups, setGroups] = useState([]);
    const [privateChats, setPrivateChats] = useState([]);

    useEffect(() => {
        if (user) {
            setGroups(user.groups || []);
            setPrivateChats(user.privateChats || []);
        } else {
            setGroups([]);
            setPrivateChats([]);
        }
    }, [user]);

    return (
        <>
            {groups.map((group) => (
                <div key={group._id} className="individual-chat" onClick={onClose}>
                    <Link to={`/chat/${group._id}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                            <div className="avatar-fallback avatar-fallback-sm" style={{ background: '#A62639' }}>
                                {(group.name || 'G')[0].toUpperCase()}
                            </div>
                            <div className="chat-info">
                                <h3>{group.name}</h3>
                                <LastMessage id={group._id.toString()} />
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

            <div className="individual-chat" style={{ borderTop: "2px solid #1a1c22" }} onClick={onClose}>
                <DialogStartChat />
            </div>

            {privateChats.map((chat) => {
                const otherUser = chat.participants?.find(p => p._id !== user.id);
                const isOnline = otherUser ? onlineSet.has(otherUser._id) : false;
                return (
                    <div key={chat._id} className="individual-chat" onClick={onClose}>
                        <Link to={`/private/${chat._id}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                                <div className="avatar-with-status">
                                    <Avatar src={otherUser?.photo} name={otherUser?.fullname || otherUser?.username} size="sm" />
                                    <span className={isOnline ? "online-dot" : "online-dot-off"} />
                                </div>
                                <div className="chat-info">
                                    <h3>{otherUser?.fullname || otherUser?.username || "Chat"}</h3>
                                    <LastMessage chatId={chat._id} />
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </>
    );
};
