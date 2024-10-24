import axios from "axios";
import { ENDPOINTS } from "../constants/url";
import { UserModel } from "../screens/Usuarios/props";

//Rota Clicar em um usuario em Pesquisa.js
export const fetchUserById = async (userId, token: string | null) => {
    try {
        if(token){
            const response = await axios.get(ENDPOINTS.USERS + "/" + userId, {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });

            const usersData = response.data;
            console.log("CRENILDO:\n", response.data[0])
            
            if (usersData.length > 0) {
                // Pegue o primeiro item da lista
                const user = usersData[0];

                const userProfile = {
                    id: user.id,
                    condominio: user.condominiumName,
                    nome: user.name,
                    image: user.userProfileImageMid,
                    interesses: user.interests || [], 
                    bio: user.bio,
                    nAmigos: user.friends
                };

                return userProfile;
            } else {
                console.log("Nenhum dado de usuário encontrado.");
            }
        } else {
            console.log("Token não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
    }
};
