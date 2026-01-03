import { configureStore } from "@reduxjs/toolkit"
import gameReducer from './slices/gameSlice.js'
import playerReducer from './slices/playerSlice.js'
import boardReducer from './slices/boardSlice.js'

const store = configureStore({
    reducer:{
        game : gameReducer,
        player : playerReducer,
        board : boardReducer
    }
});

export default store;