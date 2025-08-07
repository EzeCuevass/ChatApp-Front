import React, { createContext, useState, useEffect, useContext } from 'react';
import { SocketContext } from './socketContext.jsx';

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
    // Initialize user state
    const [user, setUser] = useState(() => {
        // Check localStorage for saved user data
        // If it exists, parse it; otherwise, initialize to null
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => {
        // Check localStorage for saved token data
        // If it exists, parse it; otherwise, initialize to null
        const saved = localStorage.getItem('token');
        return saved ? JSON.parse(saved) : null;
    });
    // Use SocketContext to access the socket instance
    const socket = useContext(SocketContext);
    // Updates localStorage whenever user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        if (token) {
            localStorage.setItem('token', JSON.stringify(token));
        } else {
            localStorage.removeItem('token');
        }
    }, [user,token])
    useEffect(() => {
        socket.on('userupdated', (updatedUser) => {
            const newtoken = updatedUser.token;
            const newUser = updatedUser.user;
            setToken(newtoken);
            setUser(newUser);
        })
    },[socket])
    // Function to log in a user
    const login = (userData, token) => {
        setToken(token);
        setUser(userData);
    };
    // Function to log out a user
    const logout = () => {
        setUser(null);
        setToken(null);
    };
    
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};