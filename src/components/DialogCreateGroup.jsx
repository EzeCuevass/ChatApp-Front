import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react"
import { Field, Fieldset, Input } from "@chakra-ui/react"
import { API_URL } from "../config.js"
import { useState, useContext } from "react"
import { SocketContext } from "../context/socketContext.jsx"
import { UserContext } from "../context/userContext.jsx"

export const CreateGroup = () => {
    const socket = useContext(SocketContext);
    const { user } = useContext(UserContext);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function createGroup(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        const groupname = inputValue.trim();
        if (!groupname) {
            setError("El nombre del grupo no puede estar vacío");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}group/createGroup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "useradmin": user.id,
                    "name": groupname
                })
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Error al crear el grupo");
            }
            setSuccess("Grupo creado correctamente");
            setInputValue("");
            socket.emit('updateusers');
            setTimeout(() => setOpen(false), 1200);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return(
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button size="md" onClick={() => { setOpen(true); setError(""); setSuccess(""); }}>
                    Create Group
                </Button>
            </Dialog.Trigger>
            <Portal>
                <form onSubmit={createGroup}>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content bg="#282c34" color="white">
                            <Dialog.Header>
                                <Dialog.Title color="#E2F1AF">Crear grupo</Dialog.Title>
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
                                            <Field.Label color="#aaa">Nombre del grupo</Field.Label>
                                            <Input
                                                name="groupname"
                                                placeholder="Ej: La banda del código"
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
                                <Button type="submit" bg="#A62639" color="white" _hover={{ bg: "#8a1f2f" }} loading={loading} loadingText="Creando...">
                                    Crear grupo
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