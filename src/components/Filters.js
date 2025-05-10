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

export default function Filters({priceRange, setPriceRange, personsFilter, setPersonsFilter, sortOrder, setSortOrder, handleRefresh, maxPrice}) {
    const [open, setOpen] = React.useState(false);
    return (
        <Stack
            useFlexGap
            direction="row"
            spacing={{ xs: 0, sm: 2 }}
            sx={{ justifyContent: { xs: 'space-between' }, flexWrap: 'wrap', minWidth: 0 }}
        >
            <Button
                variant="outlined"
                color="neutral"
                startDecorator={<FilterAltOutlined />}
                onClick={() => setOpen(true)}
            >
                Фильтры
            </Button>
            <Button variant={'plain'} startDecorator={<RefreshRoundedIcon/>} onClick={handleRefresh}>Обновить</Button>
            <OrderSelector sortOrder={sortOrder} setSortOrder={setSortOrder}/>
            <Drawer open={open} onClose={() => setOpen(false)}>
                <Stack useFlexGap spacing={3} sx={{ p: 2 }}>
                    <DialogTitle>Фильтры</DialogTitle>
                    <ModalClose />
                    <Box>
                        <FormLabel htmlFor="filters-persons">Количество мест</FormLabel>
                        <Input
                            id="filters-persons"
                            value={personsFilter}
                            onChange={(e) => setPersonsFilter(e.target.value)}
                            placeholder="1"
                            aria-label="Persons"
                        />
                    </Box>
                    <FormControl>
                        <FormLabel>Цена</FormLabel>
                        <Slider
                            value={priceRange}
                            onChange={(e, newValue) => setPriceRange(newValue)}
                            step={100}
                            min={0}
                            max={maxPrice}
                            valueLabelDisplay="auto"
                            marks={[
                                { value: 0, label: '0р.' },
                                { value: maxPrice/2, label: `${maxPrice/2}р.` },
                                { value: maxPrice, label: `${maxPrice}р.` },
                            ]}
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
