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
import FormHelperText from '@mui/joy/FormHelperText';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

// Компонент страницы авторизации пользователя
export default function Login(){
    // Инициализация WebSocket соединения с использованием токена из localStorage
    const socketRef = useSocket(localStorage.getItem('token'));

    // Состояния для обработки ошибок валидации:
    const [usernameError, setUsernameError] = useState(false); // Ошибка логина
    const [usernameErrorMsg, setUsernameErrorMsg] = useState(''); // Текст ошибки логина
    const [passwordError, setPasswordError] = useState(false); // Ошибка пароля
    const [passwordErrorMsg, setPasswordErrorMsg] = useState(''); // Текст ошибки пароля

    return(
        <Box
            component="main"
            sx={{
                justifyContent: 'center',
                minHeight: '100dvh', // Минимальная высота на весь экран
                my: 'auto',
                py: 2,
                pb: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: 400, // Фиксированная ширина формы
                maxWidth: '100%', // Адаптивность на мобильных устройствах
                mx: 'auto', // Центрирование по горизонтали
                borderRadius: 'sm',
                '& form': {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                },
                // Скрытие asterisk (*) у обязательных полей
                [`& .MuiFormLabel-asterisk`]: {
                    visibility: 'hidden',
                },
            }}
        >
            {/* Заголовок формы и ссылка на регистрацию */}
            <Stack sx={{ gap: 4, mb: 2 }}>
                <Stack sx={{ gap: 1 }}>
                    <Typography component="h1" level="h3">
                        Войти
                    </Typography>
                    <Typography level="body-sm">
                        Нет аккаунта?{' '}
                        <Link href="/register" level="title-sm">
                            Зарегистрироваться
                        </Link>
                    </Typography>
                </Stack>
            </Stack>

            {/* Декоративный разделитель */}
            <Divider
                sx={(theme) => ({
                    [theme.getColorSchemeSelector('light')]: {
                        color: { xs: '#FFF', md: 'text.tertiary' },
                    },
                })}
            >
                или
            </Divider>

            {/* Основная форма входа */}
            <Stack sx={{ gap: 4, mt: 2 }}>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        const formElements = event.currentTarget.elements;
                        // Получение значений из формы
                        const username = formElements.username.value.trim();
                        const password = formElements.password.value;

                        // Валидация полей с использованием регулярных выражений:
                        const usernameValid = /^[a-zA-Z0-9_]{3,30}$/.test(username); // Логин: 3-30 символов (буквы, цифры, _)
                        const passwordValid = /^[^\s]{3,100}$/.test(password); // Пароль: 3-100 символов без пробелов

                        // Обработка ошибок валидации
                        if (!usernameValid) {
                            setUsernameError(true);
                            setUsernameErrorMsg("Неверный формат логина");
                            return;
                        }

                        if (!passwordValid) {
                            setPasswordError(true);
                            setPasswordErrorMsg("Пароль должен быть от 3 символов без пробелов");
                            return;
                        }

                        // Отправка данных на сервер через WebSocket
                        socketRef.current.emit('login', { username: username, password: password }, (res) => {
                            if (res.success) {
                                // Успешная авторизация:
                                localStorage.setItem('token', res.token); // Сохранение токена
                                window.location.href='/'; // Перенаправление на главную
                            } else {
                                // Обработка ошибок сервера
                                if (res.error == 'Неверные данные' || res.error == 'Ошибка при входе' || res.error == 'Логин должен содержать 3–30 символов: буквы, цифры, подчеркивания'){
                                    setUsernameError(true);
                                    setUsernameErrorMsg(res.error);
                                } else {
                                    setPasswordError(true);
                                    setPasswordErrorMsg(res.error);
                                }
                            }
                        });
                    }}
                >
                    {/* Поле ввода логина */}
                    <FormControl required error={usernameError}>
                        <FormLabel>Логин</FormLabel>
                        <Input
                            name="username"
                            onChange={()=>{setUsernameError(false)}} // Сброс ошибки при изменении
                        />
                        {usernameError && (
                            <FormHelperText>
                                <InfoOutlined/>
                                {usernameErrorMsg}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* Поле ввода пароля */}
                    <FormControl required error={passwordError}>
                        <FormLabel>Пароль</FormLabel>
                        <Input
                            type="password"
                            name="password"
                            onChange={()=>{setPasswordError(false)}} // Сброс ошибки при изменении
                        />
                        {passwordError && (
                            <FormHelperText>
                                <InfoOutlined/>
                                {passwordErrorMsg}
                            </FormHelperText>
                        )}
                    </FormControl>

                    {/* Кнопка отправки формы */}
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" fullWidth>
                            Войти
                        </Button>
                    </Box>
                </form>
            </Stack>
        </Box>
    )
}