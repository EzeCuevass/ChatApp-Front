import React, { createContext, useMemo } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../config.js';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io(API_URL, {
        autoConnect: true,
        reconnection: true
    }), []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
