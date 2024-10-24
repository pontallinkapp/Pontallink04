import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, FlatList } from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import WebSocketService from '../../WebSocket/WebSocketService'; // Importe seu hook de WebSocket
import { fetchFriendRequest } from "../../apis/fetchFriendRequest";
import { fetchFriendsList } from "../../apis/fetchFriendsList";
import { useSelector, useDispatch } from 'react-redux';

export default function StartChat(){
    
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const token = useSelector((state) => state.auth.token);

    useEffect(() =>{
        const getFriends = async () => {
            if(token){
                const friendsData = await fetchFriendsList(token);
                setUsers(friendsData);
                console.log("Amigos: ", friendsData)
            } else {
                console.log('Nenhum token encontrado, não é possível buscar usuários.');
            }
        };
        getFriends();
    }, [token]);

    const navigation = useNavigation();

    const filteredResults = users.filter((user) => {
        const term = searchTerm && typeof searchTerm === 'string' ? searchTerm.trim() : ""; // Garante que searchTerm seja uma string
    
        /*if(term === ""){
            return false;
        }*/
    
        const nomeIncludes = user.name.toLowerCase().includes(term.toLowerCase());
    
        const filterCondition = term ? nomeIncludes : true;
    
        return filterCondition;
    });
    
    const handleChatRoom = (id) => {
        navigation.navigate("ChatRoom", {friendId: id})
    }
    
    return(
        <View>
            <View style={styles.section}>
                <Text>
                    StartChat
                </Text>
                <View style={styles.divPesquisa}>
                    <TextInput
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={setSearchTerm}
                        style={styles.pesquisaText}
                    />
                </View>
                <FlatList
                    data={filteredResults}
                    keyExtractor={(item, index) =>  `${index}`}
                    renderItem={({ item }) => (
                        <View>
                            <ScrollView
                            vertical showsVerticalScrollIndicator={false}
                            // Oculta a barra de rolagem horizontal>
                            >
                                <TouchableOpacity style={[styles.estiloMensagem, {backgroundColor: "red"}]} onPress={() => handleChatRoom(item.id)}>

                                <View style={styles.imageText}>
                                    <Image source={{uri: item.image}} style={styles.imagemPerfil}/>
                                    <Text style={styles.remetente}>{item.name}</Text>
                                </View>

                                </TouchableOpacity>
                            </ScrollView>
                            {/* Adicione mais informações conforme necessário */}
                        </View>
                    )}
                />
            </View>
            <Footer/>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        height: "87%",
        backgroundColor: "#a3d9ff"
    },
    divPesquisa:{
      borderWidth: 5,
      borderRadius: 3,
      margin: 3,
      
    },
    pesquisaText:{
      height: 40,
      fontSize: 18
    },
    estiloMensagem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 60,
      width: "98%",
      borderRadius: 20,
      margin: 5
  
    },
    imageText:{
      flexDirection: "row",
      alignItems: "center",
    },
    remetente:{
      fontWeight: "bold",
      textAlign: "center",
      
    },
    imagemPerfil:{
      width: 50,
      height: 50,
      borderRadius: 30,
      marginRight: 8,
      marginLeft: 5
  
    },
})