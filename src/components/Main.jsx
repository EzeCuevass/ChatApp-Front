import React from "react";
import '../App.css'
import { Link } from "react-router-dom";
import { ChatsAvailable } from "./ChatsAvailable.jsx";
import { UserContext } from "../context/userContext.jsx";
import { useContext } from "react";
import GeneralChat from "./GeneralChat.jsx";
import { Routes, Route } from "react-router-dom";
import GroupChat from "./GroupChat.jsx";
import { LastMessage } from "./lastMessage.jsx";
const Main = () => {
    const { user } = useContext(UserContext);

    return (
        <div id="main">
            <div className="box-chats">
                <div className="individual-chat">
                    <Link to="/">
                        <p>General Chat</p>
                        <LastMessage />
                    </Link>
                </div>
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