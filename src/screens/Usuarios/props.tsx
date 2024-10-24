export interface UserModel{
    id: number;
    condominio: string;
    nome: string;
    image: string;
    interesses: [string?, string?, string?, string?, string?, string?];
    bio: string;
    nAmigos: number;
    //nSeguidores: number;
}

export interface RequestFriendModel{
    idRequest: number;
    idFriend: number;
    name: string;
    image: string;
}
