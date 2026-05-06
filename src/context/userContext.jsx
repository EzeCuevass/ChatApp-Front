import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { SocketContext } from './socketContext.jsx';
import { API_URL } from '../config.js';

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const socket = useContext(SocketContext);

    // Restore session from httpOnly cookie on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const res = await fetch(`${API_URL}users/current`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setToken(data.token);
                }
            } catch (err) {
                console.log('No session to restore');
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    // Listen for user updates from socket (groups changed, etc.)
    useEffect(() => {
        const handler = (updatedUser) => {
            setToken(updatedUser.token);
            setUser(updatedUser.user);
        };
        socket.on('userupdated', handler);
        return () => socket.off('userupdated', handler);
    }, [socket]);

    const login = useCallback((userData, token) => {
        setToken(token);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
    }, []);

    return (
        <UserContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
