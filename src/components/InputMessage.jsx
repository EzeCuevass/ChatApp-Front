import { Input, Button, Group} from "@chakra-ui/react"
import { SocketContext } from "../context/socketContext.jsx";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext.jsx";
const InputMessage = ({idGroup}) => {
    // InputMessage component
    // Handles sending messages in both general and group chats
    // Uses the SocketContext to access the socket instance
    // Uses the UserContext to access the current user data
    const socket = useContext(SocketContext);
    const { user } = useContext(UserContext);
    // State to manage the message input
    const [message, setMessage] = useState("");
    // Function to handle sending messages
    const postmsg = async (data) => {
        data.preventDefault();
        if(!message.trim()) return;
        if(!user){
            socket.emit('sendmessage', message);
        } else {
            await socket.emit('sendmessage', message, user.id);
        }
        setMessage("");
    }
    // Function to handle sending messages in group chats
    const postmsgGroup = async (data) => {
        data.preventDefault();
        if(!message.trim()) return;
        await socket.emit('sendmessagetogroup',idGroup, message, user.id );
        setMessage("");
    }

    return (
        // Form to handle message input and submission
        // If idGroup is provided, it sends messages to a specific group
        // Otherwise, it sends messages to the general chat
        <form onSubmit={idGroup? postmsgGroup : postmsg} className="InputMessage">
            <Group w={"100%"} h="100%" attached>
                <Input 
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                bg="#3a3f4b"
                border="none"
                color="white"
                _placeholder={{ color: "#888" }}
                />
                <Button type="submit" bg="#A62639" color="white" _hover={{ bg: "#8a1f2f" }}>
                    Send
                </Button>
            </Group>
        </form>
    )
}
export default InputMessage