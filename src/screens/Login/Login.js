import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as animatable from "react-native-animatable";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/AuthSlice"; // Verifique se o caminho está correto
import usersData from "../../DBTeste/usersData";

export default function Login() {
    console.log("Tela de Login está sendo carregada.");

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch(); // Importa e usa o dispatch

    const { error, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogin = () => {
        dispatch(loginUser(email, senha));
    };

    useEffect(() => {
        console.log("isAuthenticated:", isAuthenticated);
        if(isAuthenticated){
            navigation.navigate("Feed");
            //Impede que o usuario volte para Login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Feed' }],
            });
        }
    }, [isAuthenticated, navigation]);
    //[isAuthenticated, navigation] array de monitoramento.
    //O React irá reexecutar a função de efeito sempre que alguma das variáveis neste array mudar.

    return (
        <View style={styles.container}>
            
            <View style={styles.containerLogo}>
                <animatable.Image
                    delay={600}
                    animation="fadeIn"
                    source={require('../../assets/logo31.png')}
                    style={{width: "100%"}}
                    resizeMode="contain"
                />
            </View>

            <animatable.View animation="fadeIn" delay={600} style={styles.containerForm}>

                
                <TextInput
                style={styles.input}
                placeholder="Email"
                //value="email"
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                />

                <TextInput
                style={styles.input}
                placeholder="Senha"
                //value="senha"
                onChangeText={setSenha}
                secureTextEntry
                />
                
                <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
                    <Text style={styles.LoginText}>Logar</Text>
                </TouchableOpacity>

                {error ? <Text style={styles.error}>{error}</Text> : null}

            </animatable.View>
            
        </View>
        
    );

}



const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#7DA8DE",
        justifyContent: "center",

    },
    containerLogo:{
        alingItems: "center",
        marginBottom: 50
    },
    buttonLogin:{
        backgroundColor: "#fff",
        width: "100%",
        borderRadius: 30,
        paddingVertical: 8,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        width: 250,
        marginLeft: 80,
    },
    LoginText:{
        color: "#7DA8DE",
        fontSize: 18,
        fontWeight: "bold"
    },
    input: {
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
        marginTop: 20,
        marginLeft: 40,
        marginRight: 40,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    error:{
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
        marginTop: 20,
        marginLeft: 80,
        marginRight: 80,
        paddingHorizontal: 6,
        paddingVertical: 8,
        fontSize: 16,
        color: "red",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    }
})

console.log("Tela de Login - Fim");