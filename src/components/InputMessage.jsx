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
            <Group w={"100%"} h="100%">
                <Input 
                placeholder="Write a message..."
                value={message}
                onChange={(e) => user ? setMessage(e.target.value, user.id) : setMessage(e.target.value)}
                ></Input>
                <Button placeholder="Send" type="submit">Send</Button>
            </Group>
        </form>
    )
}
export default InputMessage