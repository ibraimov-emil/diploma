import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

import { CreateChatDto } from './dto/create-chat.dto';
import { AddUserToChatDto } from './dto/add-user-to-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {ChatService} from "./chats.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthUser} from "../utils/decorators";
import {User} from "../users/users.model";
import {Chat} from "./chats.model";
import {ChatParticipant} from "./chat-participants.model";
import {Message} from "./messages.model";

@ApiTags('Чат')
@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @ApiOperation({summary: 'Создать чат'})
    @ApiResponse({status: 200, type: Chat})
    @Post()
    async createChat(@AuthUser() user: User, @Body() createChatDto: CreateChatDto) {
        return this.chatService.createChat(createChatDto.name, user.id);
    }

    @ApiOperation({summary: 'Добавить участника в чат'})
    @ApiResponse({status: 200, type: ChatParticipant})
    @Post(':chatId/users')
    async addUserToChat(@Param('chatId') chatId: number, @Body() addUserToChatDto: AddUserToChatDto) {
        return this.chatService.addUserToChat(addUserToChatDto.userId, chatId);
    }

    @ApiOperation({summary: 'Получить участников чата'})
    @ApiResponse({status: 200, type: User})
    @Get(':chatId/participants')
    async getChatParticipants(@Param('chatId') chatId: number) {
        return this.chatService.getChatParticipants(chatId);
    }

    @ApiOperation({summary: 'Отправить сообщение'})
    @ApiResponse({status: 200, type: Message})
    @Post(':chatId/messages')
    async sendMessage(@AuthUser() user: User, @Param('chatId') chatId: number, @Body() sendMessageDto: SendMessageDto) {
        return this.chatService.sendMessage(chatId, user.id, sendMessageDto.content);
    }

    @ApiOperation({summary: 'Получить сообщения чата'})
    @ApiResponse({status: 200, type: Message})
    @Get(':chatId/messages')
    async getChatMessages(@Param('chatId') chatId: number) {
        return this.chatService.getChatMessages(chatId);
    }

    @ApiOperation({summary: 'Обновить информацию чата'})
    @ApiResponse({status: 200, type: Chat})
    @Put(':chatId')
    async updateChat(@Param('chatId') chatId: number, @Body() updateChatDto: UpdateChatDto) {
        return this.chatService.updateChat(chatId, updateChatDto);
    }

    @ApiOperation({summary: 'Удалить чат'})
    @ApiResponse({status: 200, type: Chat})
    @Delete(':chatId')
    async deleteChat(@Param('chatId') chatId: number) {
        return this.chatService.deleteChat(chatId);
    }
}

