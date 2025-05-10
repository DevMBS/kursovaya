import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

/**
 * Компонент Search - поле поиска с иконкой.
 * Позволяет пользователю вводить поисковый запрос и фильтровать контент.
 *
 * @param {string} searchQuery - текущее значение поискового запроса (управляемый компонент)
 * @param {function} setSearchQuery - функция-обработчик изменения значения поиска
 * @returns {JSX.Element} Возвращает JSX-разметку поля поиска
 */
export default function Search({ searchQuery, setSearchQuery }) {
    return (
        // Контейнер для поля поиска с отступом снизу
        <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
            {/* Форм-контрол для поля ввода */}
            <FormControl sx={{ flex: 1 }}>
                {/* Поле ввода поискового запроса */}
                <Input
                    placeholder="Искать..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    startDecorator={<SearchRoundedIcon />}
                    aria-label="Search"
                />
            </FormControl>
        </Stack>
    );
}