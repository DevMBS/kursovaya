import * as React from 'react';
import MenuButton from '@mui/joy/MenuButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Dropdown from '@mui/joy/Dropdown';

/**
 * Компонент OrderSelector - выпадающий список для выбора порядка сортировки.
 * Позволяет пользователю выбирать между сортировкой по возрастанию и убыванию цены.
 *
 * @param {string} sortOrder - текущий выбранный порядок сортировки ('asc', 'desc' или undefined)
 * @param {function} setSortOrder - функция-обработчик изменения порядка сортировки
 * @returns {JSX.Element} Возвращает JSX-разметку выпадающего меню сортировки
 */
export default function OrderSelector({ sortOrder, setSortOrder }) {
    return (
        // Компонент Dropdown - контейнер для выпадающего меню
        <Dropdown>
            {/* Кнопка для открытия меню сортировки */}
            <MenuButton
                variant="plain"
                color="primary"
                endDecorator={<ArrowDropDown />}
                sx={{ whiteSpace: 'nowrap' }}
            >
                Сортировка
            </MenuButton>

            {/* Само выпадающее меню с вариантами сортировки */}
            <Menu sx={{ minWidth: 120 }}>
                {/* Пункт меню для сортировки по возрастанию цены */}
                <MenuItem onClick={() => setSortOrder('asc')}>
                    Сначала дешевые
                </MenuItem>

                {/* Пункт меню для сортировки по убыванию цены */}
                <MenuItem onClick={() => setSortOrder('desc')}>
                    Сначала дорогие
                </MenuItem>
            </Menu>
        </Dropdown>
    );
}