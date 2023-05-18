import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {ChatService} from "./chats.service";
import {UseGuards} from "@nestjs/common";
import {AccessTokenGuard} from "../common/guards/accessToken.guard";



@WebSocketGateway()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private chatService: ChatService) {}

    @UseGuards(AccessTokenGuard)
    async handleConnection(client: Socket) {
        // Logic executed when a new client connects
        console.log('Client connected:', client.id);
    }

    async handleDisconnect(client: Socket) {
        // Logic executed when a client disconnects
        console.log('Client disconnected:', client.id);
    }

    @UseGuards(AccessTokenGuard)
    @SubscribeMessage('joinChat')
    async handleJoinChat(client: Socket, data: { chatId: number }) {
        const { chatId } = data;
        // Join the client to the specified chat
        client.join(`chat:${chatId}`);
        // Send the list of chat participants to the client
        const participants = await this.chatService.getChatParticipants(chatId);
        this.server.to(client.id).emit('chatParticipants', participants);
    }

    @UseGuards(AccessTokenGuard)
    @SubscribeMessage('leaveChat')
    async handleLeaveChat(client: Socket, data: { chatId: number }) {
        const { chatId } = data;
        // Leave the client from the specified chat
        client.leave(`chat:${chatId}`);
    }

    // @UseGuards(AccessTokenGuard)
    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, data: { chatId: number; content: string }) {
        const { chatId, content } = data;
        const senderId = parseInt(client.id, 10);
        console.log('ws')
        // Send the message to the specified chat
        const message = await this.chatService.sendMessage(chatId, senderId, content);
        this.server.to(`chat:${chatId}`).emit('newMessage', message);
    }
}
