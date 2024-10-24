import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from 'react-redux'; // Acessando Redux
import {useNavigation, useRoute} from "@react-navigation/native";
import { fetchProfile } from "../../apis/fetchProfile"; // Assumindo que você tem uma função para buscar o usuário pelo ID
import { Feather } from '@expo/vector-icons';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { fetchUserById } from "../../apis/fetchUserById";
import { sendFriendRequest } from "../../apis/sendFriendRequest";
import WebSocketService from '../../WebSocket/WebSocketService'; // Importe seu hook de WebSocket
import { checkFriendRequestStatus } from "../../apis/checkFriendRequestStatus";



//Este UsersData é o do CRUD que fiz sem o back
//const usuario = usersData.find(user => user.id === 1);


export default function Perfil() {
    const [user, setUser] = useState({ interesses: [] }); // Inicialmente vazio, você pode usar null e fazer verificações
    const token = useSelector((state) => state.auth.token); // Token do usuário logado
    const navigation = useNavigation();
    const route = useRoute(); // Para obter o parâmetro userId da rota
    
    const userIdFromRoute = route.params?.userId; // ID do usuário vindo via rota Pesquisa
    //console.log("primeiroID: ",userIdFromRoute);
    const [friendRequestSent, setFriendRequestSent] = useState(false);

    useEffect(() => {
      const getUser = async () => {
        if (token) {
          try {
            if (userIdFromRoute) {
              // Caso seja o perfil de outro usuário
              const usersData = await fetchUserById(userIdFromRoute, token);
              console.log('\nDados do perfil de outro usuário:\n', usersData, "\n");
              console.log("ID: \n", userIdFromRoute)
              setUser(usersData);

              // Verifique se a solicitação de amizade foi enviada
                const requestStatus = await checkFriendRequestStatus(userIdFromRoute, token); // Função que verifica o status da solicitação
                setFriendRequestSent(requestStatus); // Atualiza o estado baseado no resultado
                console.log("Perfil Status: ", requestStatus)

            } else {
              // Caso seja o perfil do usuário logado
              const usersData = await fetchProfile(token);
              console.log('\nDados do usuário logado:\n', usersData, "\n");
              setUser(usersData);
            }

        
          } catch (error) {
            console.log('Erro ao buscar usuário:', error);
          }
        } else {
          console.log('Nenhum token encontrado, não é possível buscar usuários.');
        }
      };
  
      getUser(); // Carregar os dados do usuário (logado ou outro)
    }, [token, userIdFromRoute]);


    useEffect(() => {
        if (userIdFromRoute) {
            // Estabelecer conexão com WebSocket
            const webSocketService = WebSocketService();

            // Conectar ao WebSocket e escutar notificações de amizade
            webSocketService.connect(userIdFromRoute, (notification) => {
                if (notification.status === 'PENDING') {
                    setFriendRequestSent(true); // Solicitação de amizade enviada
                } else if (notification.status === 'ACCEPTED') {
                    console.log("Solicitação de amizade aceita.");
                }
            });

            // Limpeza na desmontagem do componente
            return () => {
                webSocketService.disconnect(); // Desconectar do WebSocket ao sair do perfil
            };
        }
    }, [userIdFromRoute]);

    // Função para enviar solicitação de amizade
    function handleAdd(userId) {
        sendFriendRequest(userId, token).then(() => {
            setFriendRequestSent(true); // Atualiza o estado após enviar a solicitação
        }).catch((error) => {
            console.error("Erro ao enviar solicitação de amizade:", error);
        });
    }

  
    // Carregando os dados...
    if (!user) {
      return <Text>Carregando...</Text>;
    }

    return (
        <>
            <Header/>
            <View style={styles.section}>
                <ScrollView 
                    vertical
                    showsVerticalScrollIndicator={false} // Oculta a barra de rolagem horizontal
                    contentContainerStyle={{ flexGrow: 1 }} // Ajuste aqui para expandir o ScrollView
                    style={styles.scroll}
                >
                    <View style={styles.container}>

                        <View style={styles.configEdit}>
                            {!userIdFromRoute && ( // Se for o perfil do usuário logado, mostrar os botões de edição
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate("EditInfo")}>
                                        <Feather name="edit" size={24} color="white" />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }} />
                                    <TouchableOpacity onPress={() => navigation.navigate("Configuracoes")}>
                                        <Feather name="settings" size={24} color="white" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                            
                        <View style={styles.configAmizadeSeguir}>
                            {userIdFromRoute && ( // Se não for o perfil do usuário logado, mostrar os botões de edição
                                <>
                                    {/* Botão para enviar solicitação de amizade */}
                                    {!friendRequestSent ? (
                                        <TouchableOpacity onPress={() => handleAdd(userIdFromRoute)} style={styles.editIcon} disabled={friendRequestSent}>
                                            <Feather name="user-plus" size={24} color="white" />
                                            <Text style={styles.buttonText}>Solicitar Amizade</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.editIcon} disabled={friendRequestSent}>
                                            <Text style={styles.buttonText}>Solicitação já enviada</Text>
                                        </TouchableOpacity>
                                    )}
                                    {/* Botão para seguir */}
                                    <TouchableOpacity /*onPress={() => handleFollow}*/ style={styles.configIcon}>
                                        <Feather name="heart" size={24} color="white" />
                                        <Text style={styles.buttonText}>Seguir</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        
                        <View>
                            <Text style={styles.condominio}>{user.condominio}</Text>
                        </View>

                        <View>
                            <Text style={styles.condominio}>{user.nome}</Text>
                        </View>

                        
                        <View style={styles.viewColunm}>

                            <View style={styles.colunaEsquerda}>
                                <View>
                                    <Text style={styles.viewTest2}>
                                        {user.interesses[0] || ""}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={styles.viewTest2}>
                                        {user.interesses[1] || ""}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={styles.viewTest2}>
                                        {user.interesses[2] || ""}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.profileImageContainer}>
                                <View style={styles.circle}>
                                    {/*<Image source={require('../../assets/foto.png')} style={styles.circleImage}/>*/}
                                    {/*<Image source={{ uri: "https://drive.usercontent.google.com/download?id=1Hg7ZeWIotQ1ee8ZRSri1V5m0ErSlOyaw" }} style={styles.circleImage} />*/}
                                    <Image source={{uri: user.image}} style={styles.circleImage}/>
                                </View>
                            </View>

                            <View style={styles.colunaDireita}>
                                <View>
                                    <Text style={styles.viewTest2}>
                                        {user.interesses[3] || ""}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={styles.viewTest2}>
                                        {user.interesses[4] || ""}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={styles.viewTest2}>
                                        {user.interesses[5] || ""}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ------------------------------------------------------- */}
                        {/* --------------------------BIO---------------------------*/}

                        <View>
                            <Text style={styles.bio}>
                                {user.bio}
                            </Text>
                        </View>

                        <View style={styles.divAmigosSeguidores}>

                            <View style={styles.divAmigos}>
                                <Text style={styles.divAmigosText}>Amigos</Text>
                                <Text style={styles.divAmigosNumber}>{user.nAmigos}</Text>
                            </View>
                            
                            <View style={styles.divSeguidores}>
                                <Text style={styles.divAmigosText}>Seguidores</Text>
                                <Text style={styles.divAmigosNumber}>{/*user.nSeguidores*/7}</Text>
                            </View>
                        </View>

                        {/*Espaçamento para não encostar na foto*/}
                        <View style={styles.espaco}/>
                    </View>
                </ScrollView>
                {/**/}
            </View>
            <Footer style={styles.footer}/>
        </>
    );
  }
  
  const styles = StyleSheet.create({
    section: {
        flex: 1, // Ocupa o espaço inteiro da tela
        backgroundColor: "yellow",
    },
    container: {
        flex: 1,
        backgroundColor: '#a3d9ff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: "2%",
    },
    footer:{
        flex: 1
    },
    scroll:{
        flex: 1,
        backgroundColor: "red"
    },
    condominio:{
        fontSize: 18,
        color: "black",
        //backgroundColor: "black",
        fontWeight: "bold",
        paddingBottom: "2%"
    },
    circle: {
        width: 140,
        height: 140,
        borderRadius: 100,
        overflow: 'hidden',
        
    },
    circleImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        
    },
    viewColunm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    colunaEsquerda: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10
    },
    colunaDireita: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10
    },
    profileImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Mantém a imagem no centro do layout
        //backgroundColor: "red"
    },
    viewTest: {
        height: "100%",
        position: "absolute"
    },
    viewTest2: {
        fontSize: 15,
        padding: 10,
        fontWeight: 'bold',
        flexShrink: 1,
        maxWidth: "100%",
        overflow: "hidden",
        //backgroundColor: "red"
    },
    bio:{
        fontSize: 15,
        padding: 9,
        fontWeight: "bold",
        color: "black",
        textAlign: "center"
    },
    sa:{
        paddingTop: "3%",
        paddingLeft: "30%",
        paddingRight: "30%"
    },
    configEdit:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16
    },
    configAmizadeSeguir:{
        flexDirection: "row"
    },
    configIcon: {
        flexDirection: 'row', // Ícone e texto lado a lado (se houver ícone)
        alignItems: 'center', // Alinha o texto no centro verticalmente
        backgroundColor: '#1E90FF', // Cor de fundo do botão "Seguir"
        padding: 10, // Espaçamento interno
        borderRadius: 8, // Bordas arredondadas
        marginVertical: 10, // Margem vertical entre os botões
        justifyContent: 'center', // Centraliza o conteúdo horizontalmente
      },
    editIcon: {
        flexDirection: 'row', // Ícone e texto lado a lado
        alignItems: 'center', // Alinha o ícone e o texto no centro verticalmente
        backgroundColor: '#4CAF50', // Cor de fundo do botão "Adicionar amigo"
        padding: 10, // Espaçamento interno
        borderRadius: 8, // Bordas arredondadas
        marginVertical: 10, // Margem vertical entre os botões
        justifyContent: 'center', // Centraliza o conteúdo horizontalmente
        marginRight: 45
    },
    buttonText: {
        color: 'white', // Cor do texto em branco
        fontSize: 16, // Tamanho da fonte
        marginLeft: 7, // Espaçamento entre o ícone e o texto
        fontWeight: 'bold', // Negrito no texto
    },
    divAmigosSeguidores:{
        flexDirection: "row", // Define a direção como linha
        justifyContent: "space-around", // Distribui os itens uniformemente ao longo do eixo principal
        alignItems: "center", // Alinha os itens ao centro ao longo do eixo transversal (vertical)
        padding: 10,
        //backgroundColor: "red"
    },
    divAmigos:{
        flexDirection: "column",
        alignItems: "center", // Centraliza horizontalmente
        paddingRight: 50,
    },

    divSeguidores:{
        flexDirection: "column",
        alignItems: "center", // Centraliza horizontalmente
    },
    divAmigosText:{
        textAlign: "center",
        color: "black",
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
    },
    divAmigosNumber:{
        backgroundColor: "#d3edfd",
        fontWeight: "bold",
        borderWidth: 4,
        textAlign: "center",
        fontSize: 20,
        width: 80,
        paddingTop: 6
    },
    espaco:{
        margin: 30,
        backgroundColor: "red"
    },

  });
  