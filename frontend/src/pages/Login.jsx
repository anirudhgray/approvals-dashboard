import {
    Paper,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
  } from '@mantine/core';
import axios from '../../axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPasswod] = useState("");

    const login = async () => {
        try {
            if (!email.length || !password.length) throw Error("Gotta fill something out, mate.")
            const res = await axios.post("/api/auth/login", {
                email,
                password
            })
            console.log(res)
            localStorage.setItem("token", res.data.token.accessToken)
            toast.success("Logged in!")
        } catch (e) {
            console.log(e)
            toast.error(`Oops: ${e?.response?.data || e}`)
        }
    }

    return (
        <div className='h-screen w-screen flex flex-col'>
            <div className={"m-auto md:w-7/12 w-5/6"}>
                <Paper radius={0} p={30}>
                <Title order={2} ta="center" mt="md" mb={50}>
                    Welcome!
                </Title>
        
                <TextInput label="Email address" value={email} onChange={e => setEmail(e.currentTarget.value)} placeholder="hello@gmail.com" size="md" />
                <PasswordInput value={password} onChange={e => setPasswod(e.currentTarget.value)} label="Password" placeholder="Your password" mt="md" size="md" />
                <Checkbox label="Keep me logged in" mt="xl" size="md" />
                <Button onClick={login} variant='outline' fullWidth mt="xl" size="md">
                    Login
                </Button>
        
                <Text ta="center" mt="md">
                    Don&apos;t have an account?{' '}
                    <Anchor href="#" weight={700} onClick={(event) => event.preventDefault()}>
                    Register
                    </Anchor>
                </Text>
                </Paper>
            </div>
        </div>
    )
}
