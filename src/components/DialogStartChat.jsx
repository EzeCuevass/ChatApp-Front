import { Button, CloseButton, Dialog, Portal, Text, HStack, VStack, Spinner } from "@chakra-ui/react"
import { Field, Fieldset, Input } from "@chakra-ui/react"
import { useEffect, useState, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config.js"
import { UserContext } from "../context/userContext.jsx"
import { SocketContext } from "../context/socketContext.jsx"
import { Avatar } from "./ui/Avatar.jsx"

const ResultItem = ({ user, onClick }) => (
    <HStack
        justify="space-between"
        p={2}
        borderRadius="md"
        _hover={{ bg: "#3a3f4b" }}
        cursor="pointer"
        onClick={onClick}
        transition="background 0.15s"
    >
        <HStack gap={2}>
            <Avatar src={user.photo} name={user.fullname || user.username} size="sm" />
            <VStack align="start" gap={0}>
                <Text color="white" fontWeight="medium">{user.fullname || user.username}</Text>
                <Text fontSize="sm" color="#888">@{user.username}</Text>
            </VStack>
        </HStack>
        <Button size="sm" bg="#A62639" color="white" _hover={{ bg: "#8a1f2f" }}>
            Chatear
        </Button>
    </HStack>
)

export const DialogStartChat = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const timerRef = useRef(null);
    const navigate = useNavigate();
    const { user, token } = useContext(UserContext);
    const socket = useContext(SocketContext);

    async function startChat(userId) {
        setError("");
        try {
            const res = await fetch(`${API_URL}privatechat/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "currentUser": token
                },
                credentials: "include"
            });
            if (!res.ok) throw new Error("Error al iniciar chat");
            const chat = await res.json();
            socket.emit('updateusers');
            navigate(`/private/${chat._id}`);
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
        return () => { if (timerRef.current) clearTimeout(timerRef.current) }
    }, [inputValue]);

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="md">
                    Nuevo chat
                </Button>
            </Dialog.Trigger>
            <Portal>
                <form onSubmit={e => e.preventDefault()}>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="#282c34" color="white">
                            <Dialog.Header>
                                <Dialog.Title color="#E2F1AF">Nuevo chat privado</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Fieldset.Root size="lg" maxW="md">
                                    <Fieldset.Content>
                                        {error && (
                                            <Text color="red.400" fontSize="sm" mb={2} p={2} bg="#3a1a1a" borderRadius="md">
                                                {error}
                                            </Text>
                                        )}
                                        <Field.Root>
                                            <Field.Label color="#aaa">Buscar usuario</Field.Label>
                                            <Input
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
                                                            onClick={() => startChat(u._id || u.id)}
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
};
