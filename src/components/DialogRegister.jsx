import { Button, CloseButton, Dialog, Portal, Fieldset, Field, Input } from "@chakra-ui/react"
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
const DialogRegister = () => {
  const navigate = useNavigate();
  async function register(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (data.password !== data.repeatPassword) {
      alert("Passwords do not match");
      return;
    }
    await axios.post(`${API_URL}users/register`,{
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      password: data.password,
      photo: data.photo
    }, {withCredentials:true})
    .then(res => {
      navigate("/");
    })
    .catch(err => {
      console.log(err);
    })
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
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>Log In</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                          <Fieldset.Root size="lg" maxW="md">
                          <Fieldset.Content>
                            {/* Full name */}
                            <Field.Root>
                              <Field.Label>Full Name</Field.Label>
                              <Input name="fullname" />
                            </Field.Root>

                            {/* Username */}
                            <Field.Root>
                              <Field.Label>Username</Field.Label>
                              <Input name="username" />
                            </Field.Root>
                            {/* Email */}
                            <Field.Root>
                              <Field.Label>Email</Field.Label>
                              <Input name="email" type="email" />
                            </Field.Root>

                            {/* Password */}
                            <Field.Root>
                              <Field.Label>Password</Field.Label>
                              <Input name="password" type="password" />
                            </Field.Root>
                            {/* Repeat Password */}
                            <Field.Root>
                              <Field.Label>Repeat Password</Field.Label>
                              <Input name="repeatPassword" type="password" />
                            </Field.Root>
                            {/* photo */}
                            <Field.Root>
                              <Field.Label>Photo</Field.Label>
                              <Input name="photo" />
                            </Field.Root>
                          </Fieldset.Content>
                        </Fieldset.Root>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button type="submit">Register</Button>
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