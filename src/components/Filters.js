import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Drawer from '@mui/joy/Drawer';
import DialogTitle from '@mui/joy/DialogTitle';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import Slider, { sliderClasses } from '@mui/joy/Slider';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';
import OrderSelector from './OrderSelector';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

/**
 * Компонент Filters - панель фильтров для сортировки и фильтрации данных.
 * Включает кнопки управления фильтрами, сортировкой и обновлением данных.
 *
 * @param {Array} priceRange - текущий диапазон цен [min, max]
 * @param {Function} setPriceRange - установщик состояния для priceRange
 * @param {String} personsFilter - текущее значение фильтра по количеству мест
 * @param {Function} setPersonsFilter - установщик состояния для personsFilter
 * @param {String} sortOrder - текущий порядок сортировки ('asc', 'desc' или '')
 * @param {Function} setSortOrder - установщик состояния для sortOrder
 * @param {Function} handleRefresh - обработчик обновления данных
 * @param {Number} maxPrice - максимальное значение цены для слайдера
 * @returns {JSX.Element} Возвращает JSX-разметку панели фильтров
 */
export default function Filters({
                                    priceRange,
                                    setPriceRange,
                                    personsFilter,
                                    setPersonsFilter,
                                    sortOrder,
                                    setSortOrder,
                                    handleRefresh,
                                    maxPrice
                                }) {
    // Состояние для управления видимостью выдвижной панели фильтров
    const [open, setOpen] = React.useState(false);

    return (
        // Основной контейнер с гибким расположением элементов
        <Stack
            useFlexGap
            direction="row"
            spacing={{ xs: 0, sm: 2 }} // Адаптивные отступы
            sx={{
                justifyContent: { xs: 'space-between' },
                flexWrap: 'wrap',
                minWidth: 0
            }}
        >
            {/* Кнопка открытия панели фильтров */}
            <Button
                variant="outlined"
                color="neutral"
                startDecorator={<FilterAltOutlined />}
                onClick={() => setOpen(true)}
            >
                Фильтры
            </Button>

            {/* Кнопка обновления данных */}
            <Button
                variant={'plain'}
                startDecorator={<RefreshRoundedIcon/>}
                onClick={handleRefresh}
            >
                Обновить
            </Button>

            {/* Компонент выбора порядка сортировки */}
            <OrderSelector
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />

            {/* Выдвижная панель с фильтрами */}
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
            >
                <Stack
                    useFlexGap
                    spacing={3}
                    sx={{ p: 2 }}
                >
                    {/* Заголовок панели фильтров */}
                    <DialogTitle>Фильтры</DialogTitle>
                    {/* Кнопка закрытия панели */}
                    <ModalClose />

                    {/* Фильтр по количеству мест */}
                    <Box>
                        <FormLabel htmlFor="filters-persons">
                            Количество мест
                        </FormLabel>
                        <Input
                            id="filters-persons"
                            value={personsFilter}
                            onChange={(e) => setPersonsFilter(e.target.value)}
                            placeholder="1"
                            aria-label="Persons"
                            type="number"
                        />
                    </Box>

                    {/* Фильтр по цене (слайдер) */}
                    <FormControl>
                        <FormLabel>Цена</FormLabel>
                        <Slider
                            value={priceRange}
                            onChange={(e, newValue) => setPriceRange(newValue)}
                            step={100} // Шаг изменения значения
                            min={0} // Минимальное значение
                            max={maxPrice} // Максимальное значение (из пропсов)
                            valueLabelDisplay="auto" // Автоматическое отображение значений
                            // Метки на слайдере
                            marks={[
                                { value: 0, label: '0р.' },
                                { value: maxPrice/2, label: `${maxPrice/2}р.` },
                                { value: maxPrice, label: `${maxPrice}р.` },
                            ]}
                            // Кастомные стили для меток
                            sx={{
                                [`& .${sliderClasses.markLabel}[data-index="0"]`]: {
                                    transform: 'none',
                                },
                                [`& .${sliderClasses.markLabel}[data-index="2"]`]: {
                                    transform: 'translateX(-100%)',
                                },
                            }}
                        />
                    </FormControl>
                </Stack>
            </Drawer>
        </Stack>
    );
}