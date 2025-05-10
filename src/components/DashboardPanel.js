import * as React from 'react';
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import {Drawer, Snackbar} from "@mui/joy";
import RentalCard from "./RentalCard";
import {createContext, useEffect, useState} from "react";
import CardInfoForm from "./CardInfoForm";
import {useSocket} from "./useSocket";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

// Создание контекста для передачи данных между компонентами
export const CardsContext = createContext();

/**
 * Компонент DashboardPanel - панель управления объявлениями пользователя.
 * Позволяет создавать, редактировать и удалять объявления об аренде.
 */
export default function DashboardPanel() {
    // Состояния компонента:
    const [myCards, setMyCards] = useState([]); // Список объявлений пользователя
    const [openEditMode, setOpenEditMode] = useState(false); // Флаг режима редактирования
    const [editingCardId, setEditingCardId] = useState(null); // ID редактируемого объявления
    const socketRef = useSocket(localStorage.getItem('token')); // WebSocket соединение
    const [openErrorAlert, setOpenErrorAlert] = useState(false); // Флаг показа ошибки
    const [errorAlertText, setErrorAlertText] = useState(''); // Текст ошибки

    /**
     * Обработчик удаления объявления
     * @param {number} id - ID объявления для удаления
     */
    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        socketRef.current.emit('delete_card', { token, id }, (res) => {
            if (res.success) {
                // Фильтрация списка после успешного удаления
                setMyCards(prevCards => prevCards.filter(item => item.id !== id));
            } else {
                // Показ ошибки при неудачном удалении
                setOpenErrorAlert(true);
                setErrorAlertText(res.error);
            }
        });
    }

    /**
     * Обработчик редактирования объявления
     * @param {number} id - ID объявления для редактирования
     */
    const handleEdit = (id) => {
        setEditingCardId(id);
        setOpenEditMode(true);
    }

    // Эффект для загрузки объявлений пользователя при монтировании
    useEffect(()=>{
        const token = localStorage.getItem('token');
        socketRef.current.emit('get_user_cards', { token }, (res) => {
            if (res.success){
                setMyCards([...myCards, ...res.cards]);
            }
            else{
                setOpenErrorAlert(true);
                setErrorAlertText(res.error);
            }
        });
    }, [])

    return (
        <Box sx={{
            height: 'calc(100vh - 55px)', // Высота с учетом навигационной панели
            width: '100%',
            overflow: 'auto', // Прокрутка при необходимости
            ml: 2, mr: 2, pb: 2 // Отступы
        }}>
            {/* Секция создания нового объявления */}
            <Typography level="h2" sx={{mt: 2}}>
                Опубликовать новое объявление
            </Typography>

            {/* Форма создания/редактирования в зависимости от режима */}
            {!openEditMode ? (
                <CardsContext.Provider value={{ myCards, setMyCards, setOpenErrorAlert, setErrorAlertText }}>
                    <CardInfoForm mode={'create'}/>
                </CardsContext.Provider>
            ) : (
                <Box sx={{height: '758.6px'}}/> // Плейсхолдер при редактировании
            )}

            {/* Секция списка объявлений пользователя */}
            <Box sx={{
                backgroundColor: "#fff",
                borderRadius: '8px',
                pb: 2
            }}>
                <Typography level="h2" sx={{mt: 4, pt: 2, textAlign: 'center'}}>
                    Мои объявления
                </Typography>

                {/* Список объявлений */}
                <Stack
                    direction="column"
                    spacing={2}
                    sx={{
                        mt: 4,
                        ml: 1,
                        mr: 1,
                        justifyContent: "flex-start",
                        alignItems: "left",
                        maxWidth: '100%'
                    }}
                >
                    {myCards.length > 0 ?
                        myCards.map(card => (
                            <RentalCard
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                key={card.id}
                                id={card.id}
                                title={card.title}
                                description={card.description}
                                image={card.image}
                                persons={card.persons}
                                location={card.location}
                                price={card.price}
                                wifi={card.wifi}
                                hasAccess={true} // Разрешение на управление
                                phone={card.phone}
                            />
                        )) :
                        <Typography level="title-lg" color="neutral" textAlign={'center'} sx={{pb: 4}}>
                            Нет объявлений
                        </Typography>
                    }
                </Stack>
            </Box>

            {/* Выдвижная панель для редактирования */}
            <Drawer
                anchor={'bottom'}
                open={openEditMode}
                onClose={()=>{setOpenEditMode(false)}}
            >
                {(openEditMode && editingCardId) && (
                    <CardsContext.Provider value={{
                        myCards,
                        setMyCards,
                        setOpenEditMode,
                        setOpenErrorAlert,
                        setErrorAlertText
                    }}>
                        <CardInfoForm
                            key={editingCardId}
                            mode={'edit'}
                            cardId={editingCardId}
                        />
                    </CardsContext.Provider>
                )}
            </Drawer>

            {/* Уведомление об ошибках */}
            <Snackbar
                autoHideDuration={5000} // Автоматическое закрытие через 5 сек
                color="danger" // Цвет для ошибок
                size="md"
                variant="outlined"
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                sx={{zIndex: 99999}} // Поверх других элементов
                open={openErrorAlert}
                onClose={()=>{setOpenErrorAlert(false)}}
            >
                <InfoOutlineIcon/>
                {errorAlertText}
            </Snackbar>
        </Box>
    );
}