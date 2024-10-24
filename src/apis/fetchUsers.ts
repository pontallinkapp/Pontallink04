import axios from "axios";
import { ENDPOINTS } from "../constants/url";
import { UserModel } from "../screens/Usuarios/props";

//Rota Pesquisa.js
export const fetchUsers = async (token: string | null) => {
    try {
        console.log("Token Users:\n", token);
        if(token){
            const response = await axios.get(ENDPOINTS.USERS + "/users", {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("\nDados dos usuários(fetchUsers):\n", response.data);

            const usersProfile: UserModel[] = response.data.map((user: any) => ({
                id: user.id,
                condominio: user.condominiumName, // Corrigido para condomínio
                nome: user.name,
                image: user.userProfileImageMid,
                interesses: user.interests || [], // Garante que seja um array
                bio: user.bio,
                nAmigos: user.friends
            }));

            return usersProfile;
        } else {
            console.log("Token não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
    }
}
