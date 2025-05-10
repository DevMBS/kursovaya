import * as React from 'react';
import { Box, IconButton } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import Link from '@mui/joy/Link';

/**
 * Компонент NavBar - навигационная панель приложения.
 * Отображает логотип, название приложения и информацию о пользователе.
 *
 * @param {string} username - имя текущего пользователя, передается через пропсы
 * @returns {JSX.Element} Возвращает JSX-разметку навигационной панели
 */
export default function NavBar({username}) {
    return (
        // Основной контейнер навигационной панели
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                top: 0,
                px: 1.5,
                py: 1,
                zIndex: 10000,
                backgroundColor: 'background.body',
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
            }}
        >
            {/* Блок с логотипом и названием приложения */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                {/* Кнопка с иконкой логотипа */}
                <IconButton size="sm" variant="soft">
                    <MapsHomeWorkIcon />
                </IconButton>
                <Typography component="h1" sx={{ fontWeight: 'xl' }}>
                    Посуточная аренда
                </Typography>
            </Box>

            {/* Блок с информацией о пользователе */}
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                <Box
                    sx={{
                        gap: 1,
                        alignItems: 'center',
                        display: 'flex'
                    }}
                >
                    {/* Аватар пользователя */}
                    <Avatar
                        variant="outlined"
                        size="sm"
                    />
                    {/* Блок с именем пользователя и ссылкой */}
                    <Box sx={{
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        {/* Имя пользователя */}
                        <Typography level="title-sm">{username}</Typography>
                        {/* Ссылка для входа в другой аккаунт */}
                        <Link
                            level="body-xs"
                            color={'neutral'}
                            href={'/login'}
                        >
                            Войти в другой аккаунт
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}