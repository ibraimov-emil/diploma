import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddUserToChatDto } from './dto/add-user-to-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {ChatService} from "./chats.service";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthUser} from "../utils/decorators";
import {User} from "../users/users.model";
import {Chat} from "./chats.model";
import {ChatParticipant} from "./chat-participants.model";
import {Message} from "./messages.model";
import {AccessTokenGuard} from "../common/guards/accessToken.guard";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";

@ApiTags('Чат')
@Controller('chats')
@ApiBearerAuth()
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @ApiOperation({summary: 'Создать чат'})
    @ApiResponse({status: 200, type: Chat})
    @UseGuards(AccessTokenGuard)
    @Post()
    createChat(@AuthUser() user: User, @Body() createChatDto: CreateChatDto) {
        return this.chatService.createChat(createChatDto.name, user.id);
    }

    @ApiOperation({summary: 'Добавить участника в чат'})
    @ApiResponse({status: 200, type: ChatParticipant})
    @UseGuards(AccessTokenGuard)
    @Post(':chatId/users')
    addUserToChat(@Param('chatId') chatId: number, @Body() addUserToChatDto: AddUserToChatDto) {
        return this.chatService.addUserToChat(addUserToChatDto.userId, chatId);
    }

    @ApiOperation({summary: 'Получить участников чата'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(AccessTokenGuard)
    @Get(':chatId/participants')
    getChatParticipants(@AuthUser() user: User,@Param('chatId') chatId: number) {
        return this.chatService.getChatParticipants(chatId, user.id);
    }

    @ApiOperation({summary: 'Получить чаты пользователя'})
    @ApiResponse({status: 200, type: [Chat]})
    @UseGuards(AccessTokenGuard)
    @Get()
    getUserChats(@AuthUser() user: User) {
        console.log(user)
        return this.chatService.getUserChats(user.id);
    }

    @ApiOperation({summary: 'Получить чаты пользователя (админ)'})
    @ApiResponse({status: 200, type: [Chat]})
    @UseGuards(AccessTokenGuard)
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get(':userId/chatsadm')
    getUserChatsAdm(@Param('userId') userId: number) {
        return this.chatService.getUserChats(userId);
    }

    @ApiOperation({summary: 'Отправить сообщение'})
    @ApiResponse({status: 200, type: Message})
    @UseGuards(AccessTokenGuard)
    @Post(':chatId/messages')
    sendMessage(@AuthUser() user: User, @Param('chatId') chatId: number, @Body() sendMessageDto: SendMessageDto) {
        return this.chatService.sendMessage(chatId, user.id, sendMessageDto.content);
    }

    @ApiOperation({summary: 'Получить сообщения чата'})
    @ApiResponse({status: 200, type: [Message]})
    @UseGuards(AccessTokenGuard)
    @Get(':chatId/messages')
    getChatMessages(@AuthUser() user: User, @Param('chatId') chatId: number) {
        return this.chatService.getChatMessages(chatId, user.id);
    }

    @ApiOperation({summary: 'Обновить информацию чата'})
    @ApiResponse({status: 200, type: Chat})
    @UseGuards(AccessTokenGuard)
    @Put(':chatId')
    updateChat(@Param('chatId') chatId: number, @Body() updateChatDto: UpdateChatDto) {
        return this.chatService.updateChat(chatId, updateChatDto);
    }

    @ApiOperation({summary: 'Удалить чат'})
    @ApiResponse({status: 200, type: Chat})
    @UseGuards(AccessTokenGuard)
    @Delete(':chatId')
    deleteChat(@Param('chatId') chatId: number) {
        return this.chatService.deleteChat(chatId);
    }
}

