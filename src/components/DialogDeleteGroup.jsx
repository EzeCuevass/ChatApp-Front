import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react"
import { Field, Fieldset, Input } from "@chakra-ui/react"
import { API_URL } from "../config.js"
import { useState , useContext} from "react"
import { SocketContext } from "../context/socketContext.jsx"
import { UserContext } from "../context/userContext.jsx"
export const DialogDeleteGroup = ({idGroup, groupName}) => {
    const socket = useContext(SocketContext);
    const { user, token } = useContext(UserContext);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function deleteGroup(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        const groupname = inputValue.trim();
        if (groupname !== groupName) {
            setError("El nombre no coincide con el grupo");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}group/${idGroup}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "currentUser": token
                }
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Error al eliminar el grupo");
            }
            setSuccess("Grupo eliminado correctamente");
            setInputValue("");
            socket.emit('updateusers');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    return(
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button size="md" colorScheme="red">
                    Delete Group
                </Button>
            </Dialog.Trigger>
            <Portal>
                <form onSubmit={deleteGroup}>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="#282c34" color="white">
                            <Dialog.Header>
                                <Dialog.Title color="#E2F1AF">Eliminar grupo</Dialog.Title>
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
                                        <Text color="#aaa" fontSize="sm" mb={2}>
                                            Escribe <strong style={{ color: "#E2F1AF" }}>{groupName}</strong> para confirmar:
                                        </Text>
                                        <Field.Root>
                                            <Input
                                                name="groupname"
                                                placeholder={groupName}
                                                value={inputValue}
                                                onChange={e => setInputValue(e.target.value)}
                                                bg="#3a3f4b"
                                                border="none"
                                                color="white"
                                                _placeholder={{ color: "#666" }}
                                            />
                                        </Field.Root>
                                    </Fieldset.Content>
                                </Fieldset.Root>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" colorScheme="whiteAlpha">Cancelar</Button>
                                </Dialog.ActionTrigger>
                                <Button type="submit" bg="#A62639" color="white" _hover={{ bg: "#8a1f2f" }} loading={loading} loadingText="Eliminando...">
                                    Eliminar grupo
                                </Button>
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