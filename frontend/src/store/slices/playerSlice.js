import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
    name: 'player',
    initialState: {
        name: "",
        isHost: false,
        isAlive: true,
        spectrum: []
    },
    reducers: {
        setPlayerName: (state, action) =>{
            state.name = action.payload;
        },
        setIsHost: (state, action) =>{
            state.isHost = action.payload;
        },
        setIsAlive: (state, action) =>{
            state.isAlive = action.payload;
        },
        setSpectrum: (state, action) =>{
            state.spectrum = action.payload;
        }
    }
});

export const {setPlayerName, setIsHost, setIsAlive, setSpectrum} = playerSlice.actions;
export default playerSlice.reducer;