import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from "../constants/url";

export const loginApi = async (email, password) => {
    const response = await axios.post((ENDPOINTS.LOGIN), {
        login: email,
        password: password,
    });
    console.log("loginApi",response.data);
    
    const token = response.data.token;
    await AsyncStorage.setItem('useToken', token);
    console.log("\nToken: ", token);

    return response.data;
    
}

const api = axios.create({
    baseURL: API_URL,
});

//Adiciona um recepctor para incluir o token nos cabeçalhos.
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("useToken");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
        
    },
    (error) => Promise.reject(error)
);

//Adicionar um receptor para lidar com as respostas
api.interceptors.response.use(
    (response) => {
        //Aqui podemos acessar e exibir o status da resposta
        console.log("Response Status: ", response.status);
        console.log("Response Data: ", response.data);
        console.log("Usuario: ", response.data.user);
        //console.log("UserId: ", response.data.UserId);
        return response;
    },
    (error) => {
        // Aqui você pode acessar e exibir o status do erro
        if (error.response) {
            // A resposta do servidor com status fora do intervalo de 2xx
            console.log('Response Error Status:', error.response.status);
            console.log('Response Error Data:', error.response.data);
        } else if (error.request) {
            // A requisição foi feita, mas não houve resposta
            console.log('Request Error:', error.request);
        } else {
            // Alguma coisa aconteceu ao configurar a requisição
            console.log('Error Message:', error.message);
        }
        return Promise.reject(error);
    }
);

export const verifyToken = async () => {
    try {
        // Recupera o token do AsyncStorage
        const token = await AsyncStorage.getItem('useToken');
        console.log("verifyToken: ", token)
        if (!token) {
            throw new Error('Token não encontrado'); // Se não houver token, lança um erro
        }

        // Envia a requisição ao backend com o token no cabeçalho
        console.log("Token enviado:", token);
        console.log("Endpoint da API:", api.defaults.baseURL + '/user/verify-token');

        const response = await api.get('/user/verify-token', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data; // Retorna os dados da resposta do backend
    } catch (error) {
        console.error('Erro ao verificar o token:', error.response ? error.response.data : error.message);

        //Se o erro for relacionado à expiração do token, remova o token
        if(error.response && error.response.status === 403){
            await AsyncStorage.removeItem("useToken");
        }
        throw error; // Propaga o erro para ser tratado no componente
    }
};

export default api;