import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { Field, Fieldset, Input } from "@chakra-ui/react"
import { useEffect, useState, useContext } from "react"
import { Box, Collapsible } from "@chakra-ui/react"
import { API_URL } from "../config.js"
import { SocketContext } from "../context/socketContext.jsx"
import { UserContext } from "../context/userContext.jsx"
export const DialogAddMember = ({idGroup}) => {
    const [inputValue, setInputValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const socket = useContext(SocketContext);
    const { user, token } = useContext(UserContext);

    async function addMember(event,userId) {
        event.preventDefault();
        await fetch(`${API_URL}group/addMembers`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "currentUser": token
            },
            body: JSON.stringify({
                "member": userId,
                "idgroup": idGroup
            })
        })
        socket.emit('updateusers')
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
                <form onSubmit={e => e.preventDefault()}>
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
                                        {inputValue.length > 0 && (
                                            <Box mt={2} color="gray.500">
                                                {searchResults.length > 0
                                                    ? searchResults.map(user => (
                                                        <div key={user._id || user.id}>
                                                            <span className="choosable-user">{user.username}</span>
                                                            {user.groups.length > 0 && user.groups.find(g => g?.group?._id === idGroup) 
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
                                <Button variant="outline">Close</Button>
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