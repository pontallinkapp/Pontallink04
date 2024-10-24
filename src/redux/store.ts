import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/AuthSlice";
import useReducer from "../features/user/UserSlice";

//Importa os reducers dos slices e os combina na store Redux
const store = configureStore({
    reducer:{
        auth: authReducer,
        user: useReducer,
    }
});

export default store;
// Definindo o tipo RootState com base nos reducers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;