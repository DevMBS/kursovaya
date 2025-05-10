import * as React from 'react';
import MenuButton from '@mui/joy/MenuButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Dropdown from '@mui/joy/Dropdown';

export default function OrderSelector({ sortOrder, setSortOrder }) {
    return (
        <Dropdown>
            <MenuButton
                variant="plain"
                color="primary"
                endDecorator={<ArrowDropDown />}
                sx={{ whiteSpace: 'nowrap' }}
            >
                Сортировка
            </MenuButton>
            <Menu sx={{ minWidth: 120 }}>
                <MenuItem onClick={() => setSortOrder('asc')}>Сначала дешевые</MenuItem>
                <MenuItem onClick={() => setSortOrder('desc')}>Сначала дорогие</MenuItem>
            </Menu>
        </Dropdown>
    );
}
