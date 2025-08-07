import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { Field, Fieldset, Input } from "@chakra-ui/react"
import { useEffect, useState, useContext } from "react"
import { Box, Collapsible } from "@chakra-ui/react"
import { API_URL } from "../config.js"
import { SocketContext } from "../context/socketContext.jsx"
import { UserContext } from "../context/userContext.jsx"
export const DialogAddMember = ({idGroup}) => {
    // Add Member Dialog Component
    //  This component makes a dialog to add members to a group

    // State to hold the input value and search results
    const [inputValue, setInputValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    // State to hold the search input value and results
    const token = localStorage.getItem('token');
    const tokenparseado = JSON.parse(token);
    
    const socket = useContext(SocketContext);
    
    const { user } = useContext(UserContext);
    // Async function to add a member to the group
    // It sends a PUT request to the server with the member's ID and group ID    
    async function addMember(event,userId) {
        event.preventDefault();
        await fetch(`${API_URL}group/addMembers`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "currentUser": tokenparseado
            },
            body: JSON.stringify({
                "member": userId,
                "idgroup": idGroup
            })
        })
        socket.emit('updateuser', user)
    }
    // Effect to fetch search results based on input value
    // It fetches users from the server that match the input value
    useEffect(() => {
        if(inputValue.length > 0) {
            fetch(`${API_URL}users/searchUsers?user=${inputValue}`)
                .then(res => res.json())
                .then(data => setSearchResults(data))
                .catch(() => setSearchResults([]));
        } else {
            setSearchResults([]);
        }
    }, [inputValue]);
    

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="md">
                    Add Member
                </Button>
            </Dialog.Trigger>
            <Portal>
                <form>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Add Member</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Fieldset.Root size="lg" maxW="md">
                                    <Fieldset.Content>
                                        <Field.Root>
                                            <Collapsible.Root>
                                                <Field.Label>Search Member</Field.Label>
                                                <Input
                                                    name="username"
                                                    value={inputValue}
                                                    onChange={e => setInputValue(e.target.value)}
                                                />
                                            </Collapsible.Root>
                                        </Field.Root>
                                        {/* Show search results */}
                                        {inputValue.length > 0 && (
                                            <Box mt={2} color="gray.500">
                                                {searchResults.length > 0
                                                    ? searchResults.map(user => (
                                                        // Map through search results and display each user
                                                        // If the user is already in the group, show a message
                                                        // Otherwise, show an "Add" button
                                                        <div key={user._id || user.id}>
                                                            <span className="choosable-user">{user.username}</span>
                                                            {user.groups.length > 0 && user.groups.find(g => g?.group?._id == idGroup) 
                                                            ? " User already in group" 
                                                            : <Button onClick={(e) => addMember(e, user._id || user.id)}>Add</Button>}
                                                        </div>
                                                    ))
                                                    : "No users found."}
                                            </Box>
                                        )}
                                    </Fieldset.Content>
                                </Fieldset.Root>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button type="submit">Add Member</Button>
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