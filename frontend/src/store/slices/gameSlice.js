import {createSlice} from '@reduxjs/toolkit'

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        roomName: "",
        players: [],
        hostId: null,
        gameStatus: 'waiting',
        winner: null
    },
    reducers: {
        setRoomName: (state, action) =>{
            state.roomName = action.payload;
        },
        setPlayers: (state, action) =>{
            state.players = action.payload;
        },
        setHostId: (state, action) =>{
            state.hostId = action.payload;
        },
        setGameStatus: (state, action) => {
            state.gameStatus = action.payload;
        },
        setWinner: (state, action) => {
            state.winner = action.payload;
        }
    }
});

export const {setRoomName, setPlayers, setHostId, setGameStatus, setWinner} = gameSlice.actions;
export default gameSlice.reducer;

