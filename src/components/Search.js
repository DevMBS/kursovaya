import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function Search({ searchQuery, setSearchQuery }) {
    return (
            <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
                <FormControl sx={{ flex: 1 }}>
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