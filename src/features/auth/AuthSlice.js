// src/features/auth/AuthSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginApi } from "../../apis/authApi"; // Corrigir para o seu método de login real

const initialState = {
    token: null,
    //userId: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
            //state.userId = action.payload.userId; // Armazena o ID do usuário
            state.isAuthenticated = true;
            
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.token = null;
            //state.userId = null; // Reseta o ID do usuário no logout
            state.isAuthenticated = false;
        },
        expirate: (state) => {
            state.token = null;
            //state.userId = null; // Reseta o ID do usuário na expiração do token
            state.isAuthenticated = false;
        }
    }
});

// Exportando as actions
export const { loginRequest, loginSuccess, loginFailure, logout, expirate } = authSlice.actions;

// Thunk para realizar o login
export const loginUser = (email, password) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const data = await loginApi(email, password); // Altere para o método correto da API
        //dispatch(loginSuccess(data));
        dispatch(loginSuccess({ token: data.token /*, userId: data.userId*/ })); // Passa o token e o userId

    } catch (error) {
        dispatch(loginFailure(error.message));
    }
};

// Exportando o reducer
export default authSlice.reducer;
