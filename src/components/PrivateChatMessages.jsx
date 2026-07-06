import React, { useEffect, useState, useContext, useRef } from 'react';
import { SocketContext } from '../context/socketContext.jsx';
import { BoxMessage } from './BoxMessage.jsx';

const PrivateChatMessages = ({ chatId }) => {
    const [messages, setMessages] = useState([]);
    const socket = useContext(SocketContext);
    const scrollDown = useRef(null);

    useEffect(() => {
        socket.emit('getprivatechatbyid', chatId);

        const chatHandler = (data) => {
            if (data.messages) {
                setMessages(data.messages);
            }
        };

        const newMessageHandler = (data) => {
            if (data.chatId === chatId && data.message) {
                setMessages(prev => [...prev, data.message]);
            }
        };

        socket.on('privatechatFront', chatHandler);
        socket.on('newmessagefrontprivate', newMessageHandler);

        return () => {
            socket.off('privatechatFront', chatHandler);
            socket.off('newmessagefrontprivate', newMessageHandler);
        };
    }, [socket, chatId]);

    useEffect(() => {
        scrollDown.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div style={{ paddingTop: "8px" }}>
            {messages.map((msg, index) => (
                <BoxMessage key={msg._id || index} msg={msg} />
            ))}
            <div ref={scrollDown} />
        </div>
    );
};

export default PrivateChatMessages;
