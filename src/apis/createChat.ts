/*/Rota ChatRoom
import axios from "axios";
import { ENDPOINTS } from "../constants/url";

export const createChat = async (friendId, token: string | null) => {
    try {
        if(token){
            const response = await axios.post(ENDPOINTS.)
        } else {
            console.log("Token não encontrado.");    
        }
    } catch (error) {
        
    }
}*/