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

export const CardsContext = createContext();

export default function DashboardPanel() {
    const [myCards, setMyCards] = useState([]);
    const [openEditMode, setOpenEditMode] = useState(false);
    const [editingCardId, setEditingCardId] = useState(null);
    const socketRef = useSocket(localStorage.getItem('token'));
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [errorAlertText, setErrorAlertText] = useState('');

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        socketRef.current.emit('delete_card', { token, id }, (res) => {
            if (res.success) {
                setMyCards(prevCards => prevCards.filter(item => item.id !== id));
            } else {
                setOpenErrorAlert(true);
                setErrorAlertText(res.error);
            }
        });
    }

    const handleEdit = (id) => {
        setEditingCardId(id);
        setOpenEditMode(true);
    }

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
        <Box sx={{height: 'calc(100vh - 55px)', width: '100%', overflow: 'auto', ml: 2, mr: 2, pb: 2}}>
            <Typography level="h2" sx={{mt: 2}}>Опубликовать новое объявление</Typography>
            {!openEditMode ? (<CardsContext.Provider value={{ myCards, setMyCards, setOpenErrorAlert, setErrorAlertText }}>
                <CardInfoForm mode={'create'}/>
            </CardsContext.Provider>) : (<Box sx={{height: '758.6px'}}/>)}
            <Box sx={{backgroundColor: "#fff", borderRadius: '8px', pb: 2}}>
                <Typography level="h2" sx={{mt: 4, pt: 2, textAlign: 'center'}}>Мои объявления</Typography>
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
                    {myCards.length > 0 ? myCards.map(card => (<RentalCard
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
                        hasAccess={true}
                        phone={card.phone}/>)) : <Typography level="title-lg" color="neutral" textAlign={'center'} sx={{pb: 4}}>Нет объявлений</Typography>}
                </Stack>
            </Box>
            <Drawer
                anchor={'bottom'}
                open={openEditMode}
                onClose={()=>{setOpenEditMode(false)}}>
                {(openEditMode && editingCardId) && (
                <CardsContext.Provider value={{ myCards, setMyCards, setOpenEditMode, setOpenErrorAlert, setErrorAlertText }}>
                    <CardInfoForm key={editingCardId} mode={'edit'} cardId={editingCardId}/>
                </CardsContext.Provider>)}
            </Drawer>
            <Snackbar
                autoHideDuration={5000}
                color="danger"
                size="md"
                variant="outlined"
                anchorOrigin={{vertical: 'top', horizontal: 'right'}} sx={{zIndex: 99999}}
                open={openErrorAlert} onClose={()=>{setOpenErrorAlert(false)}}><InfoOutlineIcon/>{errorAlertText}</Snackbar>
        </Box>
    );
}