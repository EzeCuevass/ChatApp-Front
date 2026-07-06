import React, { createContext, useContext, useEffect, useState } from 'react';
import { SocketContext } from './socketContext.jsx';

export const OnlineContext = createContext(new Set());

export const OnlineProvider = ({ children }) => {
    const [onlineSet, setOnlineSet] = useState(new Set());
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.emit('getOnlineUsers');

        const listHandler = (list) => {
            const ids = new Set(list.map(u => u.userId));
            setOnlineSet(ids);
        };

        const updateHandler = ({ userId, online }) => {
            setOnlineSet(prev => {
                const next = new Set(prev);
                if (online) next.add(userId);
                else next.delete(userId);
                return next;
            });
        };

        socket.on('onlineUsersList', listHandler);
        socket.on('onlineUsers', updateHandler);

        return () => {
            socket.off('onlineUsersList', listHandler);
            socket.off('onlineUsers', updateHandler);
        };
    }, [socket]);

    return (
        <OnlineContext.Provider value={onlineSet}>
            {children}
        </OnlineContext.Provider>
    );
};
