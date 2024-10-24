import { createSlice } from "@reduxjs/toolkit";

//Lida com a lista de usuários e o carregamento de dados de usuários
const userSlice = createSlice({
    name: "user",
    initialState: {
        user: [],
        isLoading: false,
        error: null
    },
    reducers: {
        loginRequest: (state) => {
            state.isLoading = true;
            state.error = false;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

//Exportar as ações
export const { loginRequest, loginSuccess, loginFailure, logout } = userSlice.actions;

//Exporta o reducer
export default userSlice.reducer;