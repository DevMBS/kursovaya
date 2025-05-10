import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';

import NavBar from './components/NavBar';
import RentalCard from './components/RentalCard';
import HeaderSection from './components/HeaderSection';
import DashboardPanel from "./components/DashboardPanel";
import Search from "./components/Search";
import Filters from "./components/Filters";
import {useEffect, useState} from "react";
import {useSocket} from "./components/useSocket";
import {Button, Drawer} from "@mui/joy";

export default function App() {
    const [allCards, setAllCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState([0, Infinity]);
    const [personsFilter, setPersonsFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const socketRef = useSocket(localStorage.getItem('token'));
    const [profile, setProfile] = useState(null);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [openDashboard, setOpenDashboard] = useState(false);

    const getProfile = () => {
        socketRef.current.emit('get_profile', (res) => {
            if (res.success) {
                setProfile(res.user.username);
            } else {
                window.location.href='/login';
            }
        });
    };

    const handleRefresh = () => {
        socketRef.current.emit('get_all_cards', (res) => {
            if (res.success){
                setAllCards([...res.cards])
                setMaxPrice(Math.ceil(Math.max(...res.cards.map(item => item?.price)) / 100) * 100);
            }
            else console.error(res.error);
        });

    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getProfile();
            handleRefresh();
        } else {
            window.location.href='/login';
        }
    }, []);

    const filteredCards = allCards
        .filter(card =>
            card.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            card.price >= priceRange[0] &&
            card.price <= priceRange[1] &&
            (personsFilter === '' || card.persons >= parseInt(personsFilter))
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') return a.price - b.price;
            if (sortOrder === 'desc') return b.price - a.price;
            return 0;
        });

    return (
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <NavBar username={profile}/>
        <Box
            component="main"
            sx={{
              height: 'calc(100vh - 55px)',
              display: 'grid',
              gridTemplateColumns: { xs: 'auto', md: '60% 40%' },
              gridTemplateRows: 'auto 1fr auto',
            }}
        >
          <Stack
              sx={{
                backgroundColor: 'background.surface',
                px: { xs: 2, md: 4 },
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
          >
            <HeaderSection />
              <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
          </Stack>
          <Box
              sx={{
                gridRow: 'span 3',
                display: { xs: 'none', md: 'flex' },
                backgroundColor: 'background.level1'}}
          >
              <DashboardPanel/>
          </Box>
          <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, pb: 2, minHeight: 0 }}>
              <Filters priceRange={priceRange}
                       setPriceRange={setPriceRange}
                       personsFilter={personsFilter}
                       setPersonsFilter={setPersonsFilter} sortOrder={sortOrder} setSortOrder={setSortOrder} handleRefresh={handleRefresh} maxPrice={maxPrice}/>
            <Stack spacing={2} sx={{ overflow: 'auto', pb: 2 }}>
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
            {!openDashboard && <Button onClick={()=>{setOpenDashboard(true)}} variant={'solid'} sx={{position: 'absolute', left: '50%', bottom: 30, zIndex: 999999, transform: 'translate(-50%, 0)', display: { xs: 'visible', md: 'none' }}}>Мои объявления</Button>}
            <Drawer anchor="bottom" open={openDashboard} onClose={()=>{setOpenDashboard(false)}}>
                <DashboardPanel/>
            </Drawer>
        </Box>
      </CssVarsProvider>
  );
}
