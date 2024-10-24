import React, { useEffect, useState } from 'react';

import { fetchUsers } from '../../apis/fetchUsers';
import { useSelector, useDispatch } from 'react-redux'; // Acessando Redux


const globalData = {
    users: allUsersData(),
}

export default globalData;

export const allUsersData = () => {
    const [users, setUsers] = useState([]); // Estado local para armazenar os usuários
    const token = useSelector((state) => state.auth.token); // Obtendo o token de autenticação do Redux

    useEffect(() => {
        const getUsers = async () => {
            if (token) {
                try {
                    const usersData = await fetchUsers(token); // Chamando a API
                    console.log('\nDados dos usuários (pesquisa):\n', usersData, "\n");
                    setUsers(usersData); // Atualizando o estado com os dados dos usuários
                } catch (error) {
                    console.error("Erro ao buscar usuários:", error);
                }
            } else {
                console.log('Nenhum token encontrado, não é possível buscar usuários.');
            }
        };

        getUsers(); // Chama a função para buscar os usuários quando o token estiver disponível
    }, [token]);

    return users; // Retorna os dados dos usuários
};
