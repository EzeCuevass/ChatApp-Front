import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { Field, Fieldset, Input } from "@chakra-ui/react"
import { Box, Collapsible } from "@chakra-ui/react"
import { API_URL } from "../config.js"
import { useState , useContext} from "react"
import { SocketContext } from "../context/socketContext.jsx"
import { UserContext } from "../context/userContext.jsx"
export const CreateGroup = () => {
    // Dialog Create Group Component
    // This component makes a dialog to create a group
    const socket = useContext(SocketContext);
    const { user } = useContext(UserContext);
    // State to manage input value
    const [inputValue, setInputValue] = useState("");
    // Extracting the token from localStorage
    const token = localStorage.getItem('token');
    const tokenparseado = JSON.parse(token);
    // Function to handle group creation
    async function createGroup(event) {
        event.preventDefault();
        const form = event.target;
        const groupname = form.groupname.value;
        console.log(user);
        
        // Check if the input matches the group name
        // If it matches, proceed with creation
        await fetch(`${API_URL}group/createGroup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "currentUser": tokenparseado
            },
            body: JSON.stringify({
                "useradmin": user.id,
                "name": groupname
            })
        })    
        socket.emit('updateuser', user);
    }
    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="md">
                    Create Group
                </Button>
            </Dialog.Trigger>
            <Portal>
                <form onSubmit={createGroup}>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Create Group</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Fieldset.Root size="lg" maxW="md">
                                    <Fieldset.Content>
                                        <Field.Root>
                                            <Field.Label>Type the name of the group</Field.Label>
                                            <Input
                                                name="groupname"
                                                value={inputValue}
                                                onChange={e => setInputValue(e.target.value)}
                                            />
                                        </Field.Root>
                                        
                                    </Fieldset.Content>
                                </Fieldset.Root>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button type="submit">Create Group</Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </form>
            </Portal>
        </Dialog.Root>
    )
}