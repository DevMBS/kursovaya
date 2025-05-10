import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import AddIcon from "@mui/icons-material/Add";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOn from "@mui/icons-material/LocationOn";
import CurrencyRubleIcon from "@mui/icons-material/CurrencyRuble";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import BedIcon from "@mui/icons-material/Bed";
import {Button, Checkbox} from "@mui/joy";
import Stack from "@mui/joy/Stack";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {CardsContext} from "./DashboardPanel";
import {v4 as uuidv4} from "uuid";
import {useSocket} from "./useSocket";
import { useMediaQuery } from '@mui/material';
import config from '../config';

/**
 * Компонент CardInfoForm - форма для создания/редактирования карточки объявления.
 * Обеспечивает ввод и валидацию данных, загрузку изображений и взаимодействие с сервером.
 *
 * @param {Object} props - свойства компонента
 * @param {string} props.mode - режим работы ('create' или 'edit')
 * @param {string} [props.cardId] - ID редактируемой карточки (в режиме edit)
 */
export default function CardInfoForm(props) {
    // Получение данных и методов из контекста
    const {myCards, setMyCards} = useContext(CardsContext);
    const {setOpenEditMode} = useContext(CardsContext);
    const {setOpenErrorAlert} = useContext(CardsContext);
    const {setErrorAlertText} = useContext(CardsContext);

    // Определение режима работы (создание/редактирование)
    const editMode = props.mode == 'edit';
    const socketRef = useSocket(localStorage.getItem('token'));

    // Состояния для валидации полей
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isPriceValid, setIsPriceValid] = useState(true);
    const [isPersonsValid, setIsPersonsValid] = useState(true);
    const [disableSaveCard, setDisableSaveCard] = useState(!editMode);

    // Состояния полей формы
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [phone, setPhone] = useState('');
    const [persons, setPersons] = useState('');
    const [wifi, setWifi] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);

    // Определение ширины экрана для адаптивного дизайна
    const isWideScreen = useMediaQuery('(min-width:900px)');

    // Эффект для заполнения формы данными при редактировании
    useEffect(() => {
        if (editMode && props.cardId) {
            const card = myCards.find(c => c.id === props.cardId);
            if (card) {
                setName(card.title);
                setDescription(card.description);
                setLocation(card.location);
                setPrice(card.price);
                setPhone(card.phone);
                setPersons(card.persons);
                setWifi(card.wifi);
                setPhoto(null);
                setPhotoUrl(card.image);
            }
        }
    }, [editMode, props.cardId, myCards]);

    // Регулярное выражение для валидации телефона
    const phoneRegex = /^(\+7|8|7)[\s(]*(?:\d{3})[\s)]*\s*\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

    // Обработчик изменения поля телефона
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        setIsPhoneValid(value == "" ? true : phoneRegex.test(value));
    };

    // Обработчик загрузки файла изображения
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
            setPhotoUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    // Обработчик изменения цены с валидацией
    const handlePriceChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '' || (/^(0|([1-9]\d*))(\.\d+)?$/.test(inputValue) && parseFloat(inputValue) > 0)) {
            setIsPriceValid(true);
        } else{
            setIsPriceValid(false);
        }
        setPrice(e.target.value);
    }

    // Обработчик изменения количества мест с валидацией
    const handlePersonsChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue === '' || (/^\d+$/.test(inputValue) && parseFloat(inputValue) > 0)) {
            setIsPersonsValid(true);
        } else{
            setIsPersonsValid(false);
        }
        setPersons(e.target.value);
    }

    // Эффект для управления состоянием кнопки сохранения
    useEffect(() => {
        if ((photo || (photo ?? editMode)) && name != "" && description != "" && location != "" && price != "" && phone != "" && persons != "" && isPhoneValid && isPriceValid && isPersonsValid) {
            setDisableSaveCard(false);
        } else{
            setDisableSaveCard(true);
        }
    }, [photo, name, description, location, price, phone, isPhoneValid, persons, isPersonsValid, isPriceValid]);

    /**
     * Создание новой карточки объявления
     */
    const createCard = () => {
        const id = uuidv4();
        const token = localStorage.getItem('token');

        // Валидация изображения
        if (!photo) {
            setOpenErrorAlert(true);
            setErrorAlertText('Выберите изображение');
            return;
        }

        const maxSize = 10 * 1024 * 1024;
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (photo.size > maxSize) {
            setOpenErrorAlert(true);
            setErrorAlertText('Изображение слишком большое (максимум 10 МБ)');
            return;
        }

        if (!validTypes.includes(photo.type)) {
            setOpenErrorAlert(true);
            setErrorAlertText('Неверный формат изображения. JPG, PNG, WEBP');
            return;
        }

        // Чтение файла изображения
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer);

            // Формирование объекта карточки
            const card = {
                id,
                title: name,
                description,
                persons: parseInt(persons),
                location,
                price,
                wifi,
                phone,
                image: {
                    type: photo.type,
                    data: Array.from(uint8Array) // передаём как массив чисел
                }
            };

            // Отправка данных на сервер
            socketRef.current.emit('create_card', { token, card }, (res) => {
                if (res.success) {
                    const cardWithImageUrl = {
                        ...card,
                        image: res.imagePath // путь к изображению, возвращённый сервером
                    };
                    setMyCards([cardWithImageUrl, ...myCards]);
                    // Сброс формы
                    setName('');
                    setDescription('');
                    setLocation('');
                    setPrice('');
                    setPhoto(null);
                    setPhotoUrl(null);
                    setPhone('');
                    setPersons('');
                } else {
                    setOpenErrorAlert(true);
                    setErrorAlertText(res.error);
                }
            });
        };

        reader.readAsArrayBuffer(photo);
    };

    /**
     * Редактирование существующей карточки
     */
    const editCard = () => {
        const token = localStorage.getItem('token');
        const id = props.cardId;
        const isPhotoChanged = photoUrl != null;

        // Формирование объекта карточки
        const card = {
            id,
            title: name,
            description: description,
            image: myCards.find(item => item.id === id).image,
            persons: parseInt(persons),
            location: location,
            price: price,
            wifi: wifi,
            phone: phone
        };

        /**
         * Функция отправки обновленных данных на сервер
         * @param {Object|null} imageData - данные изображения (если было изменено)
         */
        const emitUpdate = (imageData = null) => {
            socketRef.current.emit('update_card', {
                token,
                card,
                image: imageData // null если фото не менялось
            }, (res) => {
                if (res.success) {
                    // Обновление списка карточек
                    const updatedCards = myCards.map(c =>
                        c.id === id ? { ...card, image: res.imageUrl + '?v=' + Date.now() || c.image } : c
                    );
                    setMyCards(updatedCards);
                    setOpenEditMode(false);
                } else {
                    setOpenErrorAlert(true);
                    setErrorAlertText(res.error);
                }
            });
        };

        // Если изображение было изменено
        if (isPhotoChanged && photo) {
            if (!photo.type.startsWith('image/')) {
                setOpenErrorAlert(true);
                setErrorAlertText('Файл должен быть изображением');
                return;
            }
            if (photo.size > 10 * 1024 * 1024) {
                setOpenErrorAlert(true);
                setErrorAlertText('Изображение должно быть меньше 10МБ');
                return;
            }

            // Чтение нового изображения
            const reader = new FileReader();
            reader.onload = () => {
                const buffer = Array.from(new Uint8Array(reader.result));
                const extension = photo.name.split('.').pop();
                emitUpdate({ buffer, extension });
            };
            reader.readAsArrayBuffer(photo);
        } else {
            emitUpdate(); // без изменения изображения
        }
    };

    return (
        <Box sx={{position: 'relative'}}>
            <Stack
                direction={editMode ? (isWideScreen ? "row" : 'column') : "column"}
                spacing={editMode ? (isWideScreen ? 4 : 2) : 2}
                sx={{
                    mt: 4,
                    ml: 2,
                    justifyContent: "flex-start",
                    alignItems: "left",
                    maxWidth: '400px'
                }}
            >
                {/* Блок загрузки изображения */}
                <Card>
                    <input
                        type={"file"}
                        id={"upload-photo"}
                        onChange={handleFileChange}
                        style={{display: "none"}}
                        accept="image/*"
                    />
                    <Box
                        component={'label'}
                        htmlFor={"upload-photo"}
                        sx={{
                            height: '230px',
                            width: '368px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#dde2e6',
                            backgroundImage: photoUrl ? (photoUrl[0] == 'b' ? `url(${photoUrl})` : `url(${config.serverHost}${photoUrl})`) : 'none',
                            backgroundSize: 'cover',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <AddIcon sx={{fontSize: 40, display: photoUrl ? 'none' : 'visible'}}/>
                    </Box>
                    <CardContent>
                        <Typography level="title-md" sx={{color: 'text.primary'}}>Добавьте фото</Typography>
                        <Typography color={'neutral'}>Оно будет показываться в объявлении</Typography>
                    </CardContent>
                </Card>

                {/* Форма ввода данных */}
                <Stack direction={'column'} spacing={2}
                       sx={{
                           justifyContent: "flex-start",
                           alignItems: "left",
                       }}>
                    <Input
                        placeholder="Название объявления"
                        variant="outlined"
                        startDecorator={<DriveFileRenameOutlineIcon />}
                        onChange={(e)=>{setName(e.target.value)}}
                        value={name}
                    />
                    <Input
                        placeholder="Краткое описание"
                        variant="outlined"
                        startDecorator={<DescriptionIcon />}
                        onChange={(e)=>{setDescription(e.target.value)}}
                        value={description}
                    />
                    <Input
                        placeholder="Локация"
                        variant="outlined"
                        startDecorator={<LocationOn />}
                        onChange={(e)=>{setLocation(e.target.value)}}
                        value={location}
                    />
                    <Input
                        placeholder="Цена за сутки"
                        variant="outlined"
                        startDecorator={<CurrencyRubleIcon />}
                        onChange={handlePriceChange}
                        value={price}
                        error={!isPriceValid}
                        inputMode={'numeric'}
                    />
                    <Input
                        placeholder="Номер для связи"
                        variant="outlined"
                        startDecorator={<ContactPhoneIcon />}
                        value={phone}
                        onChange={handlePhoneChange}
                        error={!isPhoneValid}
                        inputMode={'numeric'}
                    />
                    <Input
                        placeholder={"Количество мест"}
                        variant="outlined"
                        startDecorator={<BedIcon/>}
                        inputMode={'numeric'}
                        value={persons}
                        error={!isPersonsValid}
                        onChange={handlePersonsChange}
                    />
                    <Checkbox
                        label="Wi-Fi"
                        checked={wifi}
                        onChange={(e) => {setWifi(e.target.checked)}}
                    />
                    {editMode ? (!isWideScreen &&
                            <Button
                                disabled={disableSaveCard}
                                onClick={()=>{editCard()}}
                            >
                                Сохранить изменения
                            </Button>) :
                        <Button
                            disabled={disableSaveCard}
                            onClick={()=>{createCard()}}
                        >
                            Выложить объявление
                        </Button>
                    }
                </Stack>
            </Stack>
            {/* Кнопка сохранения для широких экранов в режиме редактирования */}
            {(editMode && isWideScreen) &&
                <Button
                    sx={{position: 'absolute', right: 20, bottom: 0}}
                    onClick={() => {editCard()}}
                    disabled={disableSaveCard}
                >
                    Сохранить изменения
                </Button>
            }
        </Box>
    )
}