import axios from "axios";
import { ENDPOINTS } from "../constants/url";

// Service para verificar o status da solicitação de amizade
export const checkFriendRequestStatus = async (friendId, token) => {
    try {
        const response = await axios.get(`${ENDPOINTS.FRIENDS}/requests/status/${friendId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Axios já converte a resposta para JSON automaticamente se o tipo de conteúdo for JSON
        if (response.status === 200) {
            return true; // Se o status for 200, significa que a solicitação foi enviada
        } else {
            return false; // Se o status for 404, significa que não há solicitação pendente
        }
    } catch (error) {
        console.error('Erro ao verificar o status da solicitação:', error);
        //throw error;
        return false; // Retorna false no erro para manter consistência
    }
};
