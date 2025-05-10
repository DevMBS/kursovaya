import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import KingBedRoundedIcon from '@mui/icons-material/KingBedRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import config from '../config';

/**
 * Компонент RentalCard - карточка объявления об аренде.
 * Отображает информацию о жилье и предоставляет интерфейс для управления (редактирование/удаление).
 *
 * @param {Object} props - свойства компонента
 * @param {string} props.description - описание объявления
 * @param {string} props.title - заголовок объявления
 * @param {boolean} [props.hasAccess=false] - флаг доступа к управлению объявлением
 * @param {string} props.image - URL изображения жилья
 * @param {number} [props.persons=0] - количество мест
 * @param {string} props.location - местоположение
 * @param {boolean} [props.wifi=false] - наличие WiFi
 * @param {number} props.price - цена за сутки
 * @param {string} props.phone - контактный телефон
 * @param {function} props.onDelete - обработчик удаления
 * @param {function} props.onEdit - обработчик редактирования
 * @param {string|number} props.id - идентификатор объявления
 * @param {string} [props.username=null] - имя владельца (опционально)
 */
export default function RentalCard(props) {
    const {
        description,
        title,
        hasAccess = false,
        image,
        persons = 0,
        location,
        wifi = false,
        price,
        phone,
        onDelete,
        onEdit,
        id,
        username = null
    } = props;

    // Логика для правильного склонения слова "место"
    let personswd = '';
    const lastTwoDigits = persons % 100;
    const lastDigit = persons % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        personswd = 'мест';
    } else {
        switch (lastDigit) {
            case 1:
                personswd = 'место';
                break;
            case 2:
            case 3:
            case 4:
                personswd = 'места';
                break;
            default:
                personswd = 'мест';
                break;
        }
    }

    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                bgcolor: 'neutral.softBg',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' }, // Адаптивный дизайн
                '&:hover': {
                    boxShadow: 'lg',
                    borderColor: 'var(--joy-palette-neutral-outlinedDisabledBorder)',
                },
            }}
        >
            {/* Блок с изображением */}
            <CardOverflow
                sx={{
                    mr: { xs: 'var(--CardOverflow-offset)', sm: 0 },
                    mb: { xs: 0, sm: 'var(--CardOverflow-offset)' },
                    '--AspectRatio-radius': {
                        xs: 'calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0',
                        sm: 'calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0 calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px))',
                    },
                }}
            >
                <AspectRatio
                    ratio="1"
                    flex
                    sx={{
                        minWidth: { sm: 120, md: 160 },
                        '--AspectRatio-maxHeight': { xs: '160px', sm: '9999px' },
                    }}
                >
                    <img alt="" src={`${config.serverHost}${image}`} />

                    {/* Кнопки управления для мобильной версии (если есть доступ) */}
                    {hasAccess && (
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                alignItems: 'center',
                                justifyContent: 'right',
                                position: 'absolute',
                                top: 0,
                                width: '100%',
                                p: 1,
                            }}
                        >
                            <IconButton
                                onClick={() => onEdit(id)}
                                variant="plain"
                                size="sm"
                                color={'warning'}
                                sx={{
                                    display: { xs: 'flex', sm: 'none' },
                                    borderRadius: '50%',
                                    zIndex: '20',
                                }}
                            >
                                <EditTwoToneIcon/>
                            </IconButton>
                            <IconButton
                                onClick={() => onDelete(id)}
                                variant="plain"
                                size="sm"
                                color={'danger'}
                                sx={{
                                    display: { xs: 'flex', sm: 'none' },
                                    borderRadius: '50%',
                                    zIndex: '20',
                                }}
                            >
                                <DeleteTwoToneIcon/>
                            </IconButton>
                        </Stack>
                    )}
                </AspectRatio>
            </CardOverflow>

            {/* Блок с информацией */}
            <CardContent>
                {/* Заголовок и описание */}
                <Stack
                    spacing={1}
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
                >
                    <div>
                        <Typography level="body-sm">{description}</Typography>
                        <Typography level="title-md">{title}</Typography>
                    </div>

                    {/* Кнопки управления для десктопной версии (если есть доступ) */}
                    {hasAccess && (
                        <Stack spacing={2} direction="row">
                            <IconButton
                                onClick={() => onEdit(id)}
                                variant="plain"
                                size="sm"
                                color={'warning'}
                                sx={{ display: { xs: 'none', sm: 'flex' }, borderRadius: '50%' }}
                            >
                                <EditTwoToneIcon/>
                            </IconButton>
                            <IconButton
                                onClick={() => onDelete(id)}
                                variant="plain"
                                size="sm"
                                color={'danger'}
                                sx={{ display: { xs: 'none', sm: 'flex' }, borderRadius: '50%' }}
                            >
                                <DeleteTwoToneIcon/>
                            </IconButton>
                        </Stack>
                    )}
                </Stack>

                {/* Детали объявления */}
                <Stack
                    spacing="0.25rem 1rem"
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: 'wrap', my: 0.25 }}
                >
                    <Typography level="body-xs" startDecorator={<FmdGoodRoundedIcon />}>
                        {location}
                    </Typography>
                    <Typography level="body-xs" startDecorator={<KingBedRoundedIcon />}>
                        {persons} {personswd}
                    </Typography>
                    {wifi && (
                        <Typography level="body-xs" startDecorator={<WifiRoundedIcon />}>
                            Wi-Fi
                        </Typography>
                    )}
                    {username && (
                        <Typography level="body-xs" startDecorator={<PersonRoundedIcon />}>
                            {username}
                        </Typography>
                    )}
                    <Typography level="body-xs" startDecorator={<PhoneRoundedIcon />}>
                        {phone}
                    </Typography>
                </Stack>

                {/* Цена */}
                <Stack direction="row" sx={{ mt: 'auto' }}>
                    <Typography level="title-lg" sx={{ flexGrow: 1, textAlign: 'right' }}>
                        <strong>{price} р.</strong> <Typography level="body-md">/сутки</Typography>
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}