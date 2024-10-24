import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import WebSocketService from '../../WebSocket/WebSocketService'; // Seu serviço de WebSocket
import { useSelector } from "react-redux";
import { fetchProfile } from "../../apis/fetchProfile";

export default function ChatRoom() {

    const [messages, setMessages] = useState([]); // Estado para armazenar mensagens
    const [newMessage, setNewMessage] = useState(''); // Estado para a nova mensagem a ser enviada
    const route = useRoute();
    
    const [userId, setUserId] = useState(null); // Estado para armazenar o userId
    const friendIdFromRoute = route.params?.friendId; // ID do amigo da rota
    const token = useSelector((state) => state.auth.token); // Token do usuário logado
    //const userId = useSelector((state) => state.auth.userId); // Pega o userId do estado global
    //console.log("ID do usuário logado:", userId);

    
    useEffect(() => {
        console.log("Amigo selecionado para o chat:", friendIdFromRoute);

        const getUserProfile = async () => {
            try {
                //const token = await AsyncStorage.getItem('token'); // Se estiver usando AsyncStorage
                const usersData = await fetchProfile(token); // Busca o perfil do usuário
                console.log('ID do usuário logado:', usersData.id);
                setUserId(usersData.id); // Armazena o userId no estado local

                // Conectar ao WebSocket apenas após o userId ser obtido
                if (usersData.id) {
                    WebSocketService.connect(
                        usersData.id, // userId obtido
                        null, // Callback para mensagens de amizade
                        (message) => { // Callback para mensagens de chat
                            const parsedMessage = JSON.parse(message.body);
                            console.log("Mensagem de chat recebida:", parsedMessage);

                            // Atualizar o estado das mensagens
                            setMessages(prevMessages => [...prevMessages, parsedMessage]);
                        }
                    );
                }
            } catch (error) {
                console.error("Erro ao obter o perfil do usuário:", error);
            }
        };

        getUserProfile();

        // Limpar a conexão quando o componente for desmontado
        return () => {
            WebSocketService.disconnect();
        };
    }, [friendIdFromRoute]);

    // Função para enviar uma mensagem
    const sendMessage = () => {
        if (newMessage.trim() !== '') {
            const message = {
                senderId: userId, // Coloque o ID do usuário atual
                receiverId: friendIdFromRoute,
                content: newMessage,
                timestamp: new Date(),
            };

            // Enviar a mensagem via WebSocket
            WebSocketService.sendMessage(`/app/chat/${friendIdFromRoute}`, message);

            // Adicionar a nova mensagem ao estado
            setMessages(prevMessages => [...prevMessages, message]);

            // Limpar o campo de entrada
            setNewMessage('');
        }
    };

    return (
        <View style={styles.container}>
            {/* Lista de mensagens */}
            <ScrollView style={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageBubble,
                            message.senderId === userId ? styles.myMessage : styles.friendMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{message.content}</Text>
                        <Text style={styles.messageTimestamp}>{new Date(message.timestamp).toLocaleTimeString()}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Entrada para nova mensagem */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Digite sua mensagem..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    messagesContainer: {
        flex: 1,
        padding: 10,
    },
    messageBubble: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    friendMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ECECEC',
    },
    messageText: {
        fontSize: 16,
    },
    messageTimestamp: {
        fontSize: 10,
        color: '#999',
        textAlign: 'right',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#CCC',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
    },
    sendButton: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#007AFF',
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
});
