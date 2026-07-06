import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { UserContext } from "../context/userContext.jsx";
import { Avatar } from "./ui/Avatar.jsx";

export const BoxMessage = ({ msg }) => {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const { user } = useContext(UserContext);
    const msgUsername = msg.user ? msg.user.username : "Anonymous";
    const currentUsername = user ? user.username : "Anonymous";
    const isOwnMessage = msgUsername === currentUsername;
    const msgPhoto = msg.user ? msg.user.photo : null;

    return (
        <Box
            key={msg._id}
            display="flex"
            flexDirection="column"
            alignItems={!isOwnMessage ? "flex-start" : "flex-end"}
            px={4}
            py={1}
            w="100%"
        >
            <Box
                display="flex"
                flexDirection={isOwnMessage ? "row-reverse" : "row"}
                alignItems="flex-end"
                gap={2}
                w="100%"
            >
                {!isOwnMessage && (
                    <Avatar src={msgPhoto} name={msgUsername} size="xs" />
                )}
                <Box
                    backgroundColor={!isOwnMessage ? "#3a3f4b" : "#A62639"}
                    color={!isOwnMessage ? "#e8e8e8" : "white"}
                    px={3}
                    py={2}
                    borderRadius="10px"
                    maxWidth="70%"
                    wordBreak="break-word"
                    boxShadow="sm"
                >
                    <strong style={{ fontSize: "0.85rem" }}>{msgUsername}:</strong>
                    <span style={{ marginLeft: 4 }}>{msg.message}</span>
                    {msg.timestamp && (
                        <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
