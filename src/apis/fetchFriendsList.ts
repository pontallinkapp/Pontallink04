import axios from "axios";
import { ENDPOINTS } from "../constants/url"
import { UserModel } from "../screens/Usuarios/props";

//Rota Notificações.js
export const fetchFriendsList = async (token: string | null) => {
    try {
        if(token){
            const response = await axios.get(ENDPOINTS.USERS + "/friendships", {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Dados da ListaAmigos(fetchFriendsList):\n", response.data);

            const requestProfile: UserModel[] = response.data.map((user: any) => ({
                id: user.id,
                name: user.name,
                image: user.userProfileImageMid
            }));

            return requestProfile;
        } else {
            console.log("Token não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar solicitações de amizade:", error);
    }
}