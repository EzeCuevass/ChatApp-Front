import { Button, CloseButton, Dialog, Portal, Fieldset, Field, Input, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useState } from "react";
const DialogRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function register(event) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (data.password !== data.repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}users/register`, {
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: data.password,
        photo: data.photo
      }, { withCredentials: true })
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.error
        || "Error al registrarse";
      setError(msg);
    }
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="md">
          Register
        </Button>
      </Dialog.Trigger>
      <Portal>
        <form onSubmit={register}>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content bg="#282c34" color="white">
                      <Dialog.Header>
                        <Dialog.Title color="#E2F1AF">Register</Dialog.Title>
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
                              <Field.Label color="#aaa">Full Name</Field.Label>
                              <Input name="fullname" bg="#3a3f4b" border="none" color="white" _placeholder={{ color: "#666" }} />
                            </Field.Root>

                            <Field.Root>
                              <Field.Label color="#aaa">Username</Field.Label>
                              <Input name="username" bg="#3a3f4b" border="none" color="white" _placeholder={{ color: "#666" }} />
                            </Field.Root>
                            <Field.Root>
                              <Field.Label color="#aaa">Email</Field.Label>
                              <Input name="email" type="email" bg="#3a3f4b" border="none" color="white" _placeholder={{ color: "#666" }} />
                            </Field.Root>

                            <Field.Root>
                              <Field.Label color="#aaa">Password</Field.Label>
                              <Input name="password" type="password" bg="#3a3f4b" border="none" color="white" _placeholder={{ color: "#666" }} />
                            </Field.Root>
                            <Field.Root>
                              <Field.Label color="#aaa">Repeat Password</Field.Label>
                              <Input name="repeatPassword" type="password" bg="#3a3f4b" border="none" color="white" _placeholder={{ color: "#666" }} />
                            </Field.Root>
                            <Field.Root>
                              <Field.Label color="#aaa">Photo URL</Field.Label>
                              <Input name="photo" bg="#3a3f4b" border="none" color="white" _placeholder={{ color: "#666" }} />
                            </Field.Root>
                          </Fieldset.Content>
                        </Fieldset.Root>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline" colorScheme="whiteAlpha">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button type="submit" bg="#A62639" color="white" _hover={{ bg: "#8a1f2f" }}>Register</Button>
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
export default DialogRegister