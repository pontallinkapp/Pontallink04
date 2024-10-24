import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; // Acessando Redux
import { useNavigation } from "@react-navigation/native";
import { verifyToken } from '../apis/authApi'; // Função para verificar o token
import { expirate } from '../features/auth/AuthSlice'; // Action de expiração

const PrivateRoute = ({ component: Component, ...rest }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Obtendo o estado de autenticação e token do Redux
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const result = await verifyToken(); // Não passa o token, já é obtido dentro da função
                if (result.status === 'valid') {
                    // Token válido, continua
                } else {
                    // Token inválido, expira a sessão
                    dispatch(expirate());
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }
            } catch (error) {
                // Erro na verificação, expira a sessão
                dispatch(expirate());
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            } finally {
                setLoading(false); // Para de exibir o loading
            }
        };
    
        if (isAuthenticated) {
            checkToken();
        } else {
            setLoading(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    }, [isAuthenticated]);
    

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return isAuthenticated ? <Component {...rest} /> : (
        <Text>Redirecionando para login...</Text>
    );
};

export default PrivateRoute;
