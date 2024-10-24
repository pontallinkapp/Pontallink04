import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../constants/url";
import 'text-encoding';

const WebSocketService = {
    client: null,

    connect(userId, onFriendshipMessage, onChatMessage) {
        if (!userId) {
            console.error("userId não definido. Não é possível conectar ao WebSocket.");
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(`http://10.0.2.2:3000/ws`), // Constrói o WebSocket usando SockJS
            debug: (str) => {
                console.log(str); // Para debugar
            },
            onConnect: () => {
                console.log("Conectado ao WebSocket");

                // Inscrição no tópico de amizade específico do usuário
                if (onFriendshipMessage) {
                    this.client.subscribe(`/topic/friendships/${userId}`, (message) => {
                        if (message.body) {
                            const notification = JSON.parse(message.body);
                            onFriendshipMessage(notification); // Chama a função callback para amizade
                        }
                    });
                }

                // Inscrição no tópico de chat
                if (onChatMessage) {
                    this.client.subscribe(`/topic/chat/${userId}`, (message) => {
                        if (message.body) {
                            const chatMessage = JSON.parse(message.body);
                            onChatMessage(chatMessage); // Chama a função callback para chat
                        }
                    });
                }
            },
            onStompError: (frame) => {
                console.log("Erro no WebSocket: " + frame.headers['message']);
            },
        });

        this.client.activate(); // Ativa o cliente WebSocket
    },

    sendMessage(destination, message) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: destination, // Destino (por exemplo, "/app/sendMessage")
                body: JSON.stringify(message), // Conteúdo da mensagem em formato JSON
            });
            console.log("Mensagem enviada:", message);
        } else {
            console.error("WebSocket não conectado. Não é possível enviar a mensagem.");
        }
    },

    disconnect() {
        if (this.client) {
            this.client.deactivate(); // Desconecta o cliente WebSocket
            console.log("Desconectado do WebSocket");
        }
    }
};

export default WebSocketService;
