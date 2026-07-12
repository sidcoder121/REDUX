import {comfigureStore} from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice'

export const store = configureStore({
    reducer:{
        counter:counterReducer

    }
})

