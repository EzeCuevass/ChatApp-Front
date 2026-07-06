import { Input, Button, Group} from "@chakra-ui/react"
import { SocketContext } from "../context/socketContext.jsx";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext.jsx";
const InputMessage = ({idGroup, chatId}) => {
    const socket = useContext(SocketContext);
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState("");

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

    const postmsgGroup = async (data) => {
        data.preventDefault();
        if(!message.trim()) return;
        await socket.emit('sendmessagetogroup',idGroup, message, user.id );
        setMessage("");
    }

    const postmsgPrivate = async (data) => {
        data.preventDefault();
        if(!message.trim()) return;
        await socket.emit('sendmessagetoprivate', chatId, message, user.id );
        setMessage("");
    }

    const handler = chatId ? postmsgPrivate : (idGroup ? postmsgGroup : postmsg);

    return (
        <form onSubmit={handler} className="InputMessage">
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