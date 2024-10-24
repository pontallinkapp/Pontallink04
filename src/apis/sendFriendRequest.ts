import axios from "axios"
import { ENDPOINTS } from "../constants/url"


export const sendFriendRequest = async(userId, token: string | null) => {
    try {
        if(token){
            const response = await axios.post(ENDPOINTS.FRIENDS + "/requests/" + userId, {}, {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });

            
            console.log("Solicitação enviada com sucesso:", response.data);
            return response.data;  // Retorna o resultado para o chamador da função, caso precise
        } else {
            console.log("Nenhum dado de usuário encontrado.");
            console.log("URL: ", ENDPOINTS.FRIENDS + "/requests/" + userId)
        }
    } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
        throw error;
    }
}