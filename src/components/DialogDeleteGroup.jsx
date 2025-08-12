import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { Field, Fieldset, Input } from "@chakra-ui/react"
import { Box, Collapsible } from "@chakra-ui/react"
import { API_URL } from "../config.js"
import { useState , useContext} from "react"
import { SocketContext } from "../context/socketContext.jsx"
import { UserContext } from "../context/userContext.jsx"
export const DialogDeleteGroup = ({idGroup, groupName}) => {
    // Dialog Delete Group Component
    // This component makes a dialog to delete a group
    // It requires the group ID and group name to confirm deletion
    const socket = useContext(SocketContext);
    const { user } = useContext(UserContext);
    // State to manage input value
    const [inputValue, setInputValue] = useState("");
    // Extracting the token from localStorage
    const token = localStorage.getItem('token');
    const tokenparseado = JSON.parse(token);
    // Function to handle group deletion
    async function deleteGroup(event) {
        event.preventDefault();
        const form = event.target;
        const groupname = form.groupname.value;
        // Check if the input matches the group name
        // If it matches, proceed with deletion
        if (groupname === groupName) {
            await fetch(`${API_URL}group/deleteGroup:id?id=${idGroup}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "currentUser": tokenparseado
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log("Group deleted:", data);
            })
            .catch(err => {
                console.error("Error deleting group:", err);
            });
            socket.emit('updateusers');
        } else {
            alert("Group name does not match. Please try again.");
        }
    }
    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="md">
                    Delete Group
                </Button>
            </Dialog.Trigger>
            <Portal>
                <form onSubmit={deleteGroup}>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Delete Group</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Fieldset.Root size="lg" maxW="md">
                                    <Fieldset.Content>
                                        <Field.Root>
                                            <Field.Label>Type the name of the group to delete</Field.Label>
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
                                <Button type="submit">Delete Group</Button>
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