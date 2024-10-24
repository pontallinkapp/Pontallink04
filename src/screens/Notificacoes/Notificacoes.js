import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import solicitacoesData from '../../DBTeste/solicitacoesData';
import { useSelector } from 'react-redux';
import { fetchFriendRequest } from '../../apis/fetchFriendRequest';
import { confirmRequest } from '../../apis/confirmRequest';

export default function Mensagens() {

  const [requestFriends, setRequestFriends] = useState([]);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const getRequestFriends = async () => {
      if (token) {
        const requestData = await fetchFriendRequest(token);
        console.log("Dados das solicitações(notificações): \n", requestData);
        setRequestFriends(requestData);
      } else {
        console.log('Nenhum token encontrado, não é possível buscar usuários.');
      }
    };
    getRequestFriends();
  }, [token]);
    
  function handleConfirm(idFriendshipRequest) {
    confirmRequest(idFriendshipRequest, token)
  }

  return (
    <View>
        <Header/>
        <View style={styles.section}>
            <ScrollView 
            vertical
            showsVerticalScrollIndicator={false} // Oculta a barra de rolagem horizontal
            >
                
              <View>
                {requestFriends.map((request) => (
                  <View key={request.idRequest}>
                    <View
                      key={request.idFriend}
                      style={[styles.estiloMensagem, {backgroundColor: request.color}]}
                    >
                      <View style={styles.imageText}>
                        <Image source={{uri: request.image}} style={styles.imagemPerfil}/>
                        <Text style={styles.remetente}>{request.name}</Text>
                      </View>
                                

                      <View style={styles.botoesContainer}>
                                    
                        <TouchableOpacity style={styles.botaoAceitar} onPress={() => handleConfirm(request.idRequest)}>
                          <Text style={styles.textoBotao}>Aceitar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botaoRecusar}>
                          <Text style={styles.textoBotao}>Recusar</Text>
                        </TouchableOpacity>

                      </View>

                                
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View style={styles.espaco}/>
        </View>
        <Footer/>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    height: "74%", // 70% da tela
    // Estilos adicionais para a seção
    backgroundColor: "#7EA5D9"
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

  },botoesContainer: {
    flexDirection: "row",
    alignItems: "center",

  },botaoAceitar: {
    backgroundColor: "white",
    height: 30,
    width: 100,
    alignItems: "center",
    marginRight: 5,
    borderRadius: 5

  },botaoRecusar: {
    backgroundColor: "white",
    height: 30,
    width: 100,
    alignItems: "center",
    borderRadius: 5,
    marginRight: 10

  },textoBotao: {
    lineHeight: 30,
    fontWeight: "bold",

  },imageText:{
    flexDirection: "row",
    alignItems: "center",
  },
  espaco:{
      margin: 30,
      backgroundColor: "red"
  }

});
