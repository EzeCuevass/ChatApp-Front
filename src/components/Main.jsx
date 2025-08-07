import React, { useEffect } from "react";
import '../App.css'
import { Link } from "react-router-dom";
import { ChatsAvailable } from "./ChatsAvailable.jsx";
import { UserContext } from "../context/userContext.jsx";
import { useContext } from "react";
import GeneralChat from "./GeneralChat.jsx";
import { Routes, Route } from "react-router-dom";
import GroupChat from "./GroupChat.jsx";
import { API_URL } from "../config.js";
import { LastMessage } from "./lastMessage.jsx";
import { useState } from "react";
const Main = () => {
    // Main component
    // Displays the main chat interface with available chats and messages
    const { user } = useContext(UserContext);
    const [lastMessage, setLastMessage] = useState(null);
    // UseEffect to fetch the last message from the General Chat
    useEffect(() => {
        fetch(`${API_URL}getLastMessage`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            setLastMessage(data);
        })
    }, []);

    return (
        <div id="main">
            <div className="box-chats">
                <div className="individual-chat">
                    <Link to="/">
                        <p>General Chat</p>
                        <LastMessage message={lastMessage ? lastMessage : "No messages yet"} />
                    </Link>
                </div>
                {/* If user is logged in, show available chats, otherwise show a message */}
                { user ? <ChatsAvailable /> : <p className="individual-chat">Please log in to see your chats</p> }
                
            </div>
            <Routes>
                <Route path="/" element={<GeneralChat />} />
                <Route path="/chat/:id" element={<GroupChat />} />
            </Routes>
        </div>
    );
}
export default Main;