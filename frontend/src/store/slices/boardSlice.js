import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
    name: 'board',
    initialState: {
        grid: [],
        currentPiece: null,
        currentPosition: {x: 0, y: 0},
        nextPiece: null
    },
    reducers: {
        setGrid: (state, action) => {
            state.grid = action.payload;
        },
        setCurrentPiece: (state, action) => {
            state.currentPiece = action.payload;
        },
        setCurrentPosition: (state, action) => {
            state.currentPosition = action.payload;
        },
        setNextPiece: (state, action) => {
            state.nextPiece = action.payload;
        }
    }
});

export const {setGrid, setCurrentPiece, setCurrentPosition, setNextPiece} = boardSlice.actions;
export default boardSlice.reducer;