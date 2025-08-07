import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"
import {
  Field,
  Fieldset,
  Input,
} from "@chakra-ui/react"
import axios from "axios"
import { API_URL } from "../config.js"
import { UserContext } from "../context/userContext.jsx"
import { useContext } from "react"
const DialogLogin = () => {
  // Login dialog component
  // Uses the UserContext to access the login function and user data
  const { login, user } = useContext(UserContext);
  // Async function to handle login
  async function logIn(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;
    await axios.post(`${API_URL}users/login`,{
      username,
      password
    }, {withCredentials:true})
    .then(res => {
      login(res.data.user, res.data.token)
    })
    .catch(err => {
      console.log(err);
    })
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
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Log In</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                  <Fieldset.Root size="lg" maxW="md">
                  <Fieldset.Content>
                    <Field.Root>
                      <Field.Label>Username</Field.Label>
                      <Input name="username" />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Password</Field.Label>
                      <Input name="password" type="password" />
                    </Field.Root>
                  </Fieldset.Content>
                </Fieldset.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button type="submit">Log In</Button>
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