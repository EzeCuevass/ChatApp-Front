import React, {createContext} from 'react';
import {io} from 'socket.io-client';
import { API_URL } from '../config.js';
export const SocketContext = createContext();
// Create a socket connection
export const socket = io(API_URL)

export const SocketProvider = ({children}) => {
    return (
        // Provide the socket connection to the context for using in components
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
};