import React, { useEffect } from "react";
import { UserContext } from "../context/userContext.jsx";
import { socket, SocketContext } from "../context/socketContext.jsx";
import { useState } from "react";
export const LastMessage = ({ id }) => {
    // LastMessage component
    // Displays the last message in the chat
    const [lastMessage, setLastMessage] = useState("");
    useEffect(()=> {
        // Handler to receive the last message from the server
        const lastMessageHandler = (lastMessage) => {
            // If the last message is an object, check if it matches the current chat id
            if (typeof lastMessage === 'object') {
                if (id==lastMessage.id){
                    // Set the last message to the state
                    if (
                        !lastMessage.lastmessage ||
                        !lastMessage.lastmessage.message ||
                        lastMessage.lastmessage.message.length === 0
                    ) {
                        setLastMessage("¡Envia el primer mensaje!");
                    } else {
                        setLastMessage(lastMessage.lastmessage.message);
                    }
                }
                // If the last message is an object, extract the message property
            } else {
                // If it's a string, set it directly 
                setLastMessage(lastMessage || "¡Envia el primer mensaje!");
            }
        }
        
        // If id is not provided, emits 'getlastmessage' to get the last message for the current user
        if (!id){
            socket.emit('getlastmessage')
            socket.on('lastmessagefront', lastMessageHandler);
        } else {
            // If id is provided, emits 'getlastmessageingroup' to get the last message for the specific group
            socket.emit('getlastmessageingroup', id)
            socket.on('lastmessagefrontgroup', lastMessageHandler);
        }

        

        return () => {
            // Cleanup function to remove the listener when the component unmounts
            socket.off('lastmessagefrontgroup', lastMessageHandler);
            socket.off('lastmessagefront', lastMessageHandler);
        }
    },[id])
    return (
        <div className="last-message">
            <p>{lastMessage}</p>
        </div>
    );
};
