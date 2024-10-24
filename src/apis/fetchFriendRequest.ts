import axios from "axios";
import { ENDPOINTS } from "../constants/url"
import { RequestFriendModel } from "../screens/Usuarios/props";

//Rota Notificações.js
export const fetchFriendRequest = async (token: string | null) => {
    try {
        if(token){
            const response = await axios.get(ENDPOINTS.FRIENDS + "/requests", {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Dados da solicitação(fetchFriendRequest):\n", response.data);

            const requestProfile: RequestFriendModel[] = response.data.map((user: any) => ({
                idRequest: user.requestId,
                idFriend: user.userId,
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