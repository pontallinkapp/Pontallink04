import { fetchProfile } from "../../apis/fetchProfile";
import { UserModel } from "./props";

//fazer uma solicitação para API
export const loadUsersData = async() => {
    const response = await fetchProfile();
    return response;
}