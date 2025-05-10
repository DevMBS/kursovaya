import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

// Компонент HeaderSection - шапка раздела с заголовком и подзаголовком
export default function HeaderSection() {
    return (
        // Основной контейнер с отступом снизу
        <Stack sx={{ mb: 2 }}>
            {/* Контейнер для заголовка с flex-распределением по ширине */}
            <Stack
                direction="row"
                sx={{
                    justifyContent: 'space-between',
                    width: '100%'
                }}
            >
                {/* Основной заголовок раздела */}
                <Typography level="h2">Аренда апартаментов</Typography>
            </Stack>
            <Typography
                level="body-md"
                color="neutral"
            >
                Забронируйте жилье на ночь у наших собственников
            </Typography>
        </Stack>
    );
}