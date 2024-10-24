import axios from "axios";
import { ENDPOINTS } from "../constants/url"

export const confirmRequest = async (idFriendshipRequest, token: string | null) => {
    try {
        console.log("Consolo log", idFriendshipRequest)
        console.log("URL: ", ENDPOINTS.FRIENDS + "/requests/" + idFriendshipRequest + "/accept")
        if(token){
            const response = await axios.put(ENDPOINTS.FRIENDS + "/requests/" + idFriendshipRequest + "/accept",
                {}, // O PUT geralmente espera um corpo, mesmo que vazio
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("STATUS: ", response.status);
            return response;
        } else {
            console.log("Token não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao aceitar solicitação de amizade:", error);
    }
}