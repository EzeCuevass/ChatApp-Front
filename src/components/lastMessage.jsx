import React, { useEffect, useContext } from "react";
import { SocketContext } from "../context/socketContext.jsx";
import { useState } from "react";

const EMPTY_MESSAGE = { message: "¡Envia el primer mensaje!" };

export const LastMessage = ({ id }) => {
    const [lastMessage, setLastMessage] = useState(EMPTY_MESSAGE);
    const socket = useContext(SocketContext);

    useEffect(() => {
        const handleGeneralMessage = (msg) => {
            if (msg && msg.message) {
                setLastMessage(msg);
            }
        };

        const handleGroupMessage = (data) => {
            if (!data || !data.lastmessage) {
                setLastMessage(EMPTY_MESSAGE);
                return;
            }
            if (data.id === id) {
                setLastMessage(data.lastmessage);
            }
        };

        if (id) {
            socket.emit('getlastmessageingroup', id);
            socket.on('lastmessagefrontgroup', handleGroupMessage);
        } else {
            socket.emit('getlastmessage');
            socket.on('lastmessagefront', handleGeneralMessage);
        }

        return () => {
            socket.off('lastmessagefrontgroup', handleGroupMessage);
            socket.off('lastmessagefront', handleGeneralMessage);
        };
    }, [id, socket]);

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="last-message">
            <p>
                <strong>
                    {lastMessage.user?.username || lastMessage.user?.name || "Anónimo"}
                </strong>
                : {lastMessage.message || ""}
                {lastMessage.timestamp && (
                    <span className="timestamp"> {formatTime(lastMessage.timestamp)}</span>
                )}
            </p>
        </div>
    );
};
