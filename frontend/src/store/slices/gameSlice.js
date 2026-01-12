import {createSlice} from '@reduxjs/toolkit'

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        roomName: "",
        players: [],
        hostId: null,
        gameStatus: 'waiting',
        winner: null,
        currentPiece: null,
        nextPiece: null,
        pendingPenaltyLines : 0
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
            const previousStatus = state.gameStatus;
            state.gameStatus = action.payload;

            if (previousStatus === 'waiting' && action.payload === 'playing') {
                state.winner = null;
                state.currentPiece = null;
                state.nextPiece = null;
                state.pendingPenaltyLines = 0;
            }

            if ((previousStatus === 'playing' || previousStatus === 'finished') && action.payload === 'waiting') {
                state.currentPiece = null;
                state.nextPiece = null;
                state.pendingPenaltyLines = 0;
            }
        },
        setWinner: (state, action) => {
            state.winner = action.payload;
        },
        setCurrentPiece: (state, action) => {
            state.currentPiece = action.payload;
        },
        setNextPiece: (state, action) => {
            state.nextPiece = action.payload;
        },
        addPenaltyLines: (state, action) => {
            state.pendingPenaltyLines += action.payload;
        },
        clearPenaltyLines: (state) => {
            state.pendingPenaltyLines = 0;
        },
    }
});

export const {
    setRoomName,
    setPlayers, 
    setHostId, 
    setGameStatus, 
    setWinner, 
    setCurrentPiece, 
    setNextPiece,
    addPenaltyLines,
    clearPenaltyLines
} = gameSlice.actions;

export default gameSlice.reducer;

