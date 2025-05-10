import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { useSocket } from './useSocket';
import {useState} from "react";
import FormHelperText from "@mui/joy/FormHelperText";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

export default function Register(){
    const socketRef = useSocket(localStorage.getItem('token'));
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
    return(
        <Box
            component="main"
            sx={{
                justifyContent: 'center',
                minHeight: '100dvh',
                my: 'auto',
                py: 2,
                pb: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: 400,
                maxWidth: '100%',
                mx: 'auto',
                borderRadius: 'sm',
                '& form': {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                },
                [`& .MuiFormLabel-asterisk`]: {
                    visibility: 'hidden',
                },
            }}
        >
            <Stack sx={{ gap: 4, mb: 2 }}>
                <Stack sx={{ gap: 1 }}>
                    <Typography component="h1" level="h3">
                        Регистрация
                    </Typography>
                    <Typography level="body-sm">
                        Уже есть аккаунт?{' '}
                        <Link href="/login" level="title-sm">
                            Войти
                        </Link>
                    </Typography>
                </Stack>
            </Stack>
            <Divider
                sx={(theme) => ({
                    [theme.getColorSchemeSelector('light')]: {
                        color: { xs: '#FFF', md: 'text.tertiary' },
                    },
                })}
            >
                или
            </Divider>
            <Stack sx={{ gap: 4, mt: 2 }}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        const formElements = event.currentTarget.elements;
                        const username = formElements.username.value.trim();
                        const password = formElements.password.value;
                        const usernameValid = /^[a-zA-Z0-9_]{3,30}$/.test(username);
                        const passwordValid = /^[^\s]{3,100}$/.test(password);

                        if (!usernameValid) {
                            setUsernameError(true);
                            setUsernameErrorMsg("Логин должен содержать 3–30 букв, цифр или _");
                            return;
                        }

                        if (!passwordValid) {
                            setPasswordError(true);
                            setPasswordErrorMsg("Пароль должен быть от 3 символов без пробелов");
                            return;
                        }

                        socketRef.current.emit('register', { username: username, password: password }, (res) => {
                            if (res.success) {
                                socketRef.current.emit('login', { username: username, password: password }, (res) => {
                                    if (res.success) {
                                        localStorage.setItem('token', res.token);
                                        window.location.href='/';
                                    }
                                });
                            } else {
                                if (res.error == 'Пароль должен быть от 3 символов и не содержать пробелов'){
                                    setPasswordError(true);
                                    setPasswordErrorMsg(res.error);
                                } else{
                                    setUsernameError(true);
                                    setUsernameErrorMsg(res.error);
                                }
                            }
                        });
                    }}
                >
                    <FormControl required error={usernameError}>
                        <FormLabel>Логин</FormLabel>
                        <Input name="username" onChange={()=>{setUsernameError(false)}}/>
                        {usernameError && <FormHelperText>
                            <InfoOutlined/>
                            {usernameErrorMsg}
                        </FormHelperText>}
                    </FormControl>
                    <FormControl required>
                        <FormLabel>Пароль</FormLabel>
                        <Input type="password" name="password"/>
                    </FormControl>
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" fullWidth>
                            Зарегистрироваться
                        </Button>
                    </Box>
                </form>
            </Stack>
        </Box>
    )
}