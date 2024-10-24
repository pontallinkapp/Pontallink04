import axios from "axios";
import { UserModel } from "../screens/Usuarios/props";
import { ENDPOINTS } from "../constants/url";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector, useDispatch } from 'react-redux'; // Acessando Redux
import { RootState } from "../redux/store";

//Rota Perfil.js
export const fetchProfile = async (token: string | null) => {
    try {
        console.log('Token Profile:', token); // Adicione este log
        if (token) {
            console.log('Token encontrado. Fazendo a requisição...');
            // Fazer a requisição com o token no header
            const response = await axios.get(ENDPOINTS.USERS + "/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("\nDados do usuário(Profile):\n", response.data);

            const user = response.data[0]; // Acessa o primeiro item do array

            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            // Estruturando os dados no formato UserModel
            const userProfile: UserModel = {
                id: user.id,
                condominio: user.condominiumName, // Corrigido para condomínio
                nome: user.name,
                image: user.userProfileImageMid,
                interesses: user.interests || [], // Garante que seja um array
                bio: user.bio,
                nAmigos: user.friends
            };


            return userProfile; // Retornando o UserModel
            
        } else {
            console.log("Token não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
    }
};

