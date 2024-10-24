import { Stomp } from "@stomp/stompjs";

const socket = new WebSocket("ws://localhost:8080/ws");
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
    console.log("Conectado: " + frame);

    //Inscrever-se no canal de chat
    stompClient.subscribe("/topic/chat", (message) =>{
        console.log("Mensagem recebida: ", message.body);
    });

    //Envia uma mensagem
    stompClient.send("/app/sendMessage", {}, JSON.stringify({
        content: "Olá",
        sender: "Usuário"
    }));
}, (error) => {
    console.error("Erro na conexão: ", error);
});