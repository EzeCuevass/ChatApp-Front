import React from "react";
import MensajesChat from "./mensajesChat";
import InputMessage from "./InputMessage.jsx";
const GeneralChat = () => {
    // General chat component
    // Displays the general chat header, messages, and input field
    return (
        <div className="chat">
                <div className="chat-header">
                    <h1>General Chat</h1>
                </div>
                <div className="chat-messages">
                    <MensajesChat />
                </div>
                <div className="chat-input">
                    <div className="input-container">
                        <InputMessage />
                    </div>
                </div>
            </div>
    )
}
export default GeneralChat;