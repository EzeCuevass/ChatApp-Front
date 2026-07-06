import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import { OnlineContext } from "../context/OnlineContext.jsx";
import PrivateChatMessages from "./PrivateChatMessages.jsx";
import InputMessage from "./InputMessage.jsx";
import { Avatar } from "./ui/Avatar.jsx";

const PrivateChat = () => {
    const { chatId } = useParams();
    const { user } = useContext(UserContext);
    const onlineSet = useContext(OnlineContext);

    const chat = user?.privateChats?.find(c => c._id === chatId);
    const otherUser = chat?.participants?.find(p => p._id !== user.id);
    const isOnline = otherUser ? onlineSet.has(otherUser._id) : false;

    return (
        <div className="chat">
            <div className="chat-header">
                <div className="avatar-with-status">
                    <Avatar src={otherUser?.photo} name={otherUser?.fullname || otherUser?.username} size="sm" />
                    <span className={isOnline ? "online-dot" : "online-dot-off"} />
                </div>
                <div>
                    <h1>{otherUser?.fullname || otherUser?.username || "Chat privado"}</h1>
                    {otherUser?.username && (
                        <p>@{otherUser.username} {isOnline ? "· En línea" : "· Desconectado"}</p>
                    )}
                </div>
            </div>
            <div className="chat-messages">
                <PrivateChatMessages chatId={chatId} />
            </div>
            <div className="chat-input">
                <div className="input-container">
                    <InputMessage chatId={chatId} />
                </div>
            </div>
        </div>
    );
};

export default PrivateChat;
