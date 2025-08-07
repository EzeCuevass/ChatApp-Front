import { Box } from "@chakra-ui/react";
import React, { useContext} from "react";
import { UserContext } from "../context/userContext.jsx";
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
    
    return (
        // if the message is from the current user, align it to the right, otherwise to the left
        <Box
            key={msg._id}
            display="flex"
            flexDirection="column"
            alignItems={!isOwnMessage ? "flex-start" : "flex-end"}
            marginBottom="10px"
        >
            <Box
                backgroundColor={!isOwnMessage ? "#E2E8F0" : "#A62639"}
                color={!isOwnMessage ? "black" : "white"}
                padding="10px"
                borderRadius="10px"
                maxWidth="70%"
                wordBreak="break-word"
            >
                <strong>{msg.user ? msg.user.username : "Anonymous"}:</strong> {msg.message}
                {msg.timestamp && (
                    <div className="timestamp">
                        {formatTimestamp(msg.timestamp)}
                    </div>
                )}
            </Box>
        </Box>
    )
}