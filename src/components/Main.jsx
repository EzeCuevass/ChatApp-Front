import React, { useContext } from "react";
import '../App.css'
import { Link } from "react-router-dom";
import { ChatsAvailable } from "./ChatsAvailable.jsx";
import { UserContext } from "../context/userContext.jsx";
import GeneralChat from "./GeneralChat.jsx";
import { Routes, Route } from "react-router-dom";
import GroupChat from "./GroupChat.jsx";
import PrivateChat from "./PrivateChat.jsx";
import { LastMessage } from "./lastMessage.jsx";

const Main = ({ sidebarOpen, onCloseSidebar }) => {
    const { user } = useContext(UserContext);

    return (
        <div id="main">
            <div
                className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
                onClick={onCloseSidebar}
            />
            <div className={`box-chats${sidebarOpen ? ' open' : ''}`}>
                <div className="individual-chat" onClick={onCloseSidebar}>
                    <Link to="/">
                        <p>General Chat</p>
                        <LastMessage />
                    </Link>
                </div>
                {user ? (
                    <ChatsAvailable onClose={onCloseSidebar} />
                ) : (
                    <p className="individual-chat" style={{ color: "#888", cursor: "default" }}>
                        Inicia sesión para ver tus chats
                    </p>
                )}
            </div>
            <Routes>
                <Route path="/" element={<GeneralChat />} />
                <Route path="/chat/:id" element={<GroupChat />} />
                <Route path="/private/:chatId" element={<PrivateChat />} />
            </Routes>
        </div>
    );
}

export default Main;
