import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';

// Импорт компонентов приложения
import NavBar from './components/NavBar';
import RentalCard from './components/RentalCard';
import HeaderSection from './components/HeaderSection';
import DashboardPanel from "./components/DashboardPanel";
import Search from "./components/Search";
import Filters from "./components/Filters";
import {useEffect, useState} from "react";
import {useSocket} from "./components/useSocket";
import {Button, Drawer} from "@mui/joy";

// Основной компонент приложения
export default function App() {
    // Состояния компонента:
    const [allCards, setAllCards] = useState([]); // Список всех карточек аренды
    const [searchQuery, setSearchQuery] = useState(''); // Строка поиска
    const [priceRange, setPriceRange] = useState([0, Infinity]); // Диапазон цен
    const [personsFilter, setPersonsFilter] = useState(''); // Фильтр по количеству человек
    const [sortOrder, setSortOrder] = useState(''); // Порядок сортировки
    const socketRef = useSocket(localStorage.getItem('token')); // WebSocket соединение
    const [profile, setProfile] = useState(null); // Данные профиля пользователя
    const [maxPrice, setMaxPrice] = useState(10000); // Максимальная цена для фильтра
    const [openDashboard, setOpenDashboard] = useState(false); // Состояние открытия панели dashboard

    // Функция получения данных профиля пользователя
    const getProfile = () => {
        socketRef.current.emit('get_profile', (res) => {
            if (res.success) {
                setProfile(res.user.username); // Установка имени пользователя
            } else {
                window.location.href='/login'; // Перенаправление на страницу входа при ошибке
            }
        });
    };

    // Функция обновления списка карточек
    const handleRefresh = () => {
        socketRef.current.emit('get_all_cards', (res) => {
            if (res.success){
                setAllCards([...res.cards]); // Обновление списка карточек
                // Расчет максимальной цены с округлением до сотен
                setMaxPrice(Math.ceil(Math.max(...res.cards.map(item => item?.price)) / 100) * 100);
            }
            else console.error(res.error); // Логирование ошибки
        });
    }

    // Эффект при монтировании компонента
    useEffect(() => {
        if (localStorage.getItem('token')) { // Проверка наличия токена
            getProfile(); // Загрузка профиля
            handleRefresh(); // Загрузка карточек
        } else {
            window.location.href='/login'; // Перенаправление на страницу входа
        }
    }, []); // Пустой массив зависимостей - выполняется только при монтировании

    // Фильтрация и сортировка карточек
    const filteredCards = allCards
        .filter(card =>
            card.title.toLowerCase().includes(searchQuery.toLowerCase()) && // Фильтр по названию
            card.price >= priceRange[0] && // Фильтр по минимальной цене
            card.price <= priceRange[1] && // Фильтр по максимальной цене
            (personsFilter === '' || card.persons >= parseInt(personsFilter)) // Фильтр по количеству человек
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') return a.price - b.price; // Сортировка по возрастанию цены
            if (sortOrder === 'desc') return b.price - a.price; // Сортировка по убыванию цены
            return 0; // Без сортировки
        });

    return (
        <CssVarsProvider disableTransitionOnChange> {/* Провайдер стилей Material-UI */}
            <CssBaseline /> {/* Нормализация стилей */}
            <NavBar username={profile}/> {/* Компонент навигационной панели */}
            <Box
                component="main"
                sx={{
                    height: 'calc(100vh - 55px)', // Высота с учетом навигационной панели
                    display: 'grid',
                    gridTemplateColumns: { xs: 'auto', md: '60% 40%' }, // Адаптивная сетка
                    gridTemplateRows: 'auto 1fr auto',
                }}
            >
                <Stack
                    sx={{
                        backgroundColor: 'background.surface',
                        px: { xs: 2, md: 4 }, // Адаптивные отступы
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <HeaderSection /> {/* Шапка секции */}
                    <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery}/> {/* Компонент поиска */}
                </Stack>
                <Box
                    sx={{
                        gridRow: 'span 3',
                        display: { xs: 'none', md: 'flex' }, // Скрытие на мобильных устройствах
                        backgroundColor: 'background.level1'}}
                >
                    <DashboardPanel/> {/* Панель управления */}
                </Box>
                <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, pb: 2, minHeight: 0 }}>
                    {/* Компонент фильтров с передачей всех необходимых пропсов */}
                    <Filters priceRange={priceRange}
                             setPriceRange={setPriceRange}
                             personsFilter={personsFilter}
                             setPersonsFilter={setPersonsFilter} sortOrder={sortOrder} setSortOrder={setSortOrder} handleRefresh={handleRefresh} maxPrice={maxPrice}/>
                    <Stack spacing={2} sx={{ overflow: 'auto', pb: 2 }}>
                        {/* Рендеринг отфильтрованных карточек */}
                        {filteredCards.map(card => (<RentalCard
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            description={card.description}
                            image={card.image}
                            persons={card.persons}
                            location={card.location}
                            price={card.price}
                            wifi={card.wifi}
                            hasAccess={false}
                            phone={card.phone}
                            username={card.username}
                        />))}
                    </Stack>
                </Stack>
                {/* Кнопка для открытия панели dashboard на мобильных устройствах */}
                {!openDashboard && <Button onClick={()=>{setOpenDashboard(true)}} variant={'solid'} sx={{position: 'absolute', left: '50%', bottom: 30, zIndex: 999999, transform: 'translate(-50%, 0)', display: { xs: 'visible', md: 'none' }}}>Мои объявления</Button>}
                {/* Выдвижная панель для мобильных устройств */}
                <Drawer anchor="bottom" open={openDashboard} onClose={()=>{setOpenDashboard(false)}}>
                    <DashboardPanel/>
                </Drawer>
            </Box>
        </CssVarsProvider>
    );
}