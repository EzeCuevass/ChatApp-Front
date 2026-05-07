import { Button, CloseButton, Dialog, Portal, Text, HStack, VStack, Spinner } from "@chakra-ui/react"
import { Field, Fieldset, Input } from "@chakra-ui/react"
import { useEffect, useState, useContext, useRef } from "react"
import { API_URL } from "../config.js"
import { SocketContext } from "../context/socketContext.jsx"
import { UserContext } from "../context/userContext.jsx"

const ResultItem = ({ user, isMember, onAdd }) => (
    <HStack
        justify="space-between"
        p={2}
        borderRadius="md"
        _hover={{ bg: "#3a3f4b" }}
        transition="background 0.15s"
    >
        <VStack align="start" gap={0}>
            <Text color="white" fontWeight="medium">{user.fullname || user.username}</Text>
            <Text fontSize="sm" color="#888">@{user.username}</Text>
        </VStack>
        {isMember ? (
            <Text fontSize="sm" color="#888" fontStyle="italic">Ya es miembro</Text>
        ) : (
            <Button size="sm" bg="#A62639" color="white" _hover={{ bg: "#8a1f2f" }} onClick={(e) => onAdd(e, user._id || user.id)}>
                Agregar
            </Button>
        )}
    </HStack>
)

export const DialogAddMember = ({idGroup}) => {
    const [inputValue, setInputValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searching, setSearching] = useState(false);
    const timerRef = useRef(null);

    const socket = useContext(SocketContext);
    const { user, token } = useContext(UserContext);

    async function addMember(event, userId) {
        event.preventDefault();
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`${API_URL}group/addMembers`, {
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
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Error al agregar miembro");
            }
            setSuccess("Miembro agregado correctamente");
            setInputValue("");
            setSearchResults([]);
            socket.emit('updateusers')
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (inputValue.length > 0) {
            setSearching(true);
            timerRef.current = setTimeout(async () => {
                try {
                    const res = await fetch(`${API_URL}users/searchUsers?user=${inputValue}`)
                    const data = await res.json()
                    setSearchResults(data)
                } catch {
                    setSearchResults([])
                } finally {
                    setSearching(false)
                }
            }, 300)
        } else {
            setSearchResults([]);
            setSearching(false);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
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
                        <Dialog.Content bg="#282c34" color="white">
                            <Dialog.Header>
                                <Dialog.Title color="#E2F1AF">Agregar miembro</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Fieldset.Root size="lg" maxW="md">
                                    <Fieldset.Content>
                                        {error && (
                                            <Text color="red.400" fontSize="sm" mb={2} p={2} bg="#3a1a1a" borderRadius="md">
                                                {error}
                                            </Text>
                                        )}
                                        {success && (
                                            <Text color="green.400" fontSize="sm" mb={2} p={2} bg="#1a3a1a" borderRadius="md">
                                                {success}
                                            </Text>
                                        )}
                                        <Field.Root>
                                            <Field.Label color="#aaa">Buscar usuario</Field.Label>
                                            <Input
                                                name="username"
                                                placeholder="Escribe un nombre de usuario..."
                                                value={inputValue}
                                                onChange={e => setInputValue(e.target.value)}
                                                bg="#3a3f4b"
                                                border="none"
                                                color="white"
                                                _placeholder={{ color: "#666" }}
                                            />
                                        </Field.Root>
                                        {searching && (
                                            <HStack justify="center" py={4}>
                                                <Spinner color="#A62639" size="sm" />
                                                <Text color="#888" fontSize="sm">Buscando...</Text>
                                            </HStack>
                                        )}
                                        {!searching && inputValue.length > 0 && (
                                            <VStack mt={2} align="stretch" maxH="200px" overflowY="auto">
                                                {searchResults.length > 0
                                                    ? searchResults.map(u => (
                                                        <ResultItem
                                                            key={u._id || u.id}
                                                            user={u}
                                                            isMember={u.groups?.length > 0 && u.groups.some(g => g?.group?._id === idGroup)}
                                                            onAdd={addMember}
                                                        />
                                                    ))
                                                    : <Text color="#666" textAlign="center" py={2}>No se encontraron usuarios</Text>
                                                }
                                            </VStack>
                                        )}
                                    </Fieldset.Content>
                                </Fieldset.Root>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" colorScheme="whiteAlpha">Cancelar</Button>
                                </Dialog.ActionTrigger>
                                <Dialog.CloseTrigger asChild>
                                    <Button variant="outline" colorScheme="whiteAlpha">Cerrar</Button>
                                </Dialog.CloseTrigger>
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