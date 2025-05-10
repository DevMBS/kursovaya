import * as React from 'react';
import { Box, IconButton } from '@mui/joy';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import Link from '@mui/joy/Link';



export default function HeaderSection({username}) {
    return (
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <IconButton size="sm" variant="soft">
                    <MapsHomeWorkIcon />
                </IconButton>
                <Typography component="h1" sx={{ fontWeight: 'xl' }}>
                    Посуточная аренда
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                <Box
                    sx={{ gap: 1, alignItems: 'center', display: 'flex' }}
                >
                    <Avatar
                        variant="outlined"
                        size="sm"
                    />
                    <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography level="title-sm">{username}</Typography>
                        <Link level="body-xs" color={'neutral'} href={'/login'}>Войти в другой аккаунт</Link>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
