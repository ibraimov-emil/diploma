import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from "./chats.service";
import { UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from "../common/guards/accessToken.guard";
import {AuthUser} from "../utils/decorators";
import {User} from "../users/users.model";

interface AuthenticatedSocket extends Socket {
    user?: User;
}

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    },
    pingInterval: 10000,
    pingTimeout: 15000,
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private activeUsers: { userId: number; socketId: string }[] = [];

    constructor(private chatService: ChatService) {}

    handleConnection(client: AuthenticatedSocket) {
        // Logic executed when a new client connects
        // console.log(client)
        console.log('Client connected:', client.id);
        // this.activeUsers.push({ userId: client.handshake.query.userId, socketId: client.id });
        console.log('New User Connected', this.activeUsers);
        this.server.emit('get-users', this.activeUsers);
    }

    async handleDisconnect(socket: AuthenticatedSocket) {
        // Logic executed when a client disconnects
        console.log(socket)
        console.log('Client disconnected:', socket);
        this.activeUsers = this.activeUsers.filter((user) => user.socketId !== socket.id);
        console.log('User Disconnected', this.activeUsers);
        this.server.emit('get-users', this.activeUsers);
    }

    // @UseGuards(AccessTokenGuard)
    @SubscribeMessage('joinChat')
    async handleJoinChat(client: Socket, data: { chatId: number, userId: number }) {
        const { chatId, userId } = data;
        // Join the client to the specified chat
        client.join(`chat:${chatId}`);
        // Send the list of chat participants to the client
        const participants = await this.chatService.getChatParticipants(chatId, userId);
        this.server.to(client.id).emit('chatParticipants', participants);
    }

    // @UseGuards(AccessTokenGuard)
    @SubscribeMessage('leaveChat')
    async handleLeaveChat(client: Socket, data: { chatId: number }) {
        const { chatId } = data;
        // Leave the client from the specified chat
        client.leave(`chat:${chatId}`);
    }

    //testversion
    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, data: { chatId: number; content: string }) {
        const { chatId, content } = data;
        const senderId = parseInt(client.id, 10);
        console.log('ws');
        // Send the message to the specified chat
        const message = await this.chatService.sendMessage(chatId, senderId, content);
        this.server.to(`chat:${chatId}`).emit('send-message', message);
    }

    @SubscribeMessage('new-user-add')
    handleNewUserAdd(client: Socket, newUserId: number) {
        // if user is not added previously
        if (!this.activeUsers.some((user) => user.userId === newUserId)) {
            this.activeUsers.push({ userId: newUserId, socketId: client.id });
            console.log("New User Connected", this.activeUsers);
        }
        // send all active users to new user
        this.server.emit("get-users", this.activeUsers);
    }

    @SubscribeMessage('disconnect')
    handleSocketDisconnect(client: Socket) {
        // remove user from active users
        this.activeUsers = this.activeUsers.filter((user) => user.socketId !== client.id);
        console.log("User Disconnected", this.activeUsers);
        // send all active users to all users
        this.server.emit("get-users", this.activeUsers);
    }

    @SubscribeMessage('send-message')
    handleSocketSendMessage(data: { receiverId: number; content: string }) {
        const { receiverId, content } = data;
        const user = this.activeUsers.find((user) => user.userId === receiverId);
        console.log("Sending from socket to:", receiverId);
        console.log("Data:", data);
        if (user) {
            this.server.to(user.socketId).emit("receive-message", data);
        }
    }
}