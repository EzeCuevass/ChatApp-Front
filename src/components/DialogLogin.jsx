import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react"
import {
  Field,
  Fieldset,
  Input,
} from "@chakra-ui/react"
import axios from "axios"
import { API_URL } from "../config.js"
import { UserContext } from "../context/userContext.jsx"
import { useContext, useState } from "react"
import { SocketContext } from "../context/socketContext.jsx"
const DialogLogin = () => {
  const { login } = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [error, setError] = useState("");

  async function logIn(event) {
    event.preventDefault();
    setError("");
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;
    try {
      const res = await axios.post(`${API_URL}users/login`, {
        username,
        password
      }, { withCredentials: true })
      login(res.data.user, res.data.token)
      socket.emit('setusername', { username: res.data.user.username, token: res.data.token });
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || "Usuario o contraseña incorrectos";
      setError(msg);
    }
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="md">
          Log In
        </Button>
      </Dialog.Trigger>
      <Portal>
        <form onSubmit={logIn}>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="#282c34" color="white">
              <Dialog.Header>
                <Dialog.Title color="#E2F1AF">Log In</Dialog.Title>
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
                      <Field.Label color="#aaa">Username</Field.Label>
                      <Input name="username" bg="#3a3f4b" border="none" color="white" _placeholder={{ color: "#666" }} />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label color="#aaa">Password</Field.Label>
                      <Input name="password" type="password" bg="#3a3f4b" border="none" color="white" _placeholder={{ color: "#666" }} />
                    </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" colorScheme="whiteAlpha">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button type="submit" bg="#A62639" color="white" _hover={{ bg: "#8a1f2f" }}>Log In</Button>
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
export default DialogLogin