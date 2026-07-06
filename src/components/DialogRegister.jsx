import { Button, CloseButton, Dialog, Portal, Fieldset, Field, Input, Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useState, useRef } from "react";

const DialogRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  async function register(event) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (data.password !== data.repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    let photoUrl = data.photo?.trim() || "";

    const file = fileRef.current?.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("La imagen no puede superar los 2 MB");
        return;
      }
      setUploading(true);
      try {
        const upForm = new FormData();
        upForm.append("photo", file);
        const upRes = await axios.post(`${API_URL}users/upload-photo`, upForm, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
        photoUrl = API_URL.replace(/\/$/, "") + upRes.data.url;
      } catch (err) {
        setError("Error al subir la foto");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      await axios.post(`${API_URL}users/register`, {
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: data.password,
        photo: photoUrl
      }, { withCredentials: true });
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
        <Button size="md">Register</Button>
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
                      <Field.Label color="#aaa">Foto de perfil (opcional)</Field.Label>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          colorScheme="whiteAlpha"
                          onClick={() => fileRef.current?.click()}
                        >
                          {fileName || "Elegir archivo"}
                        </Button>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                        />
                        <Text color="#888" fontSize="sm">o</Text>
                      </div>
                    </Field.Root>
                    <Field.Root>
                      <Input
                        name="photo"
                        placeholder="O pegá una URL..."
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
                  <Button variant="outline" colorScheme="whiteAlpha">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button type="submit" bg="#A62639" color="white" _hover={{ bg: "#8a1f2f" }} loading={uploading} loadingText="Subiendo foto...">
                  Register
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
export default DialogRegister
