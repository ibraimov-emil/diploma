import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {Chat} from "./chats.model";
import {User} from "../users/users.model";
import {Message} from "./messages.model";
import {ChatParticipant} from "./chat-participants.model";
import {UpdateChatDto} from "./dto/update-chat.dto";
import {ProcessMetricsService} from "../monitoring/process-metrics.service";

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat)
        private chatModel: typeof Chat,
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(ChatParticipant)
        private chatParticipantModel: typeof ChatParticipant,
        @InjectModel(Message)
        private messageModel: typeof Message,
        private readonly processMetricsService: ProcessMetricsService
    ) {
    }


    async createChat(name: string, creatorId: number): Promise<Chat> {
        const chat = await this.chatModel.create({name, creatorId});
        await this.chatParticipantModel.create({
            chatId: chat.id,
            userId: creatorId,
        });

        return chat;
    }

    async addUserToChat(userId: number, chatId: number): Promise<ChatParticipant> {
        const user = await this.userModel.findByPk(userId);
        // console.log(user)
        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }
        const chatParticipant = await this.chatParticipantModel.findOne({
            where: {chatId, userId}, 
            include: [{
                model: Chat,
                as: 'chat'
            }, {
                model: User,
                as: 'user'
            }]
        });
        if (chatParticipant) {
            throw new HttpException('Уже является участником чата', HttpStatus.NOT_FOUND);
        }
        return this.chatParticipantModel.create({
            chatId,
            userId,
        });
    }

    async getChatParticipants(chatId: number, userId: number): Promise<ChatParticipant[]> {
        await this.validateChatUser(chatId, userId);
        return this.chatParticipantModel.findAll({
            where: {chatId},
            include: [{
                model: User,
                as: 'user'
            }],
        });
    }

    async getUserChats(userId: number): Promise<ChatParticipant[]> {
        return this.chatParticipantModel.findAll({
            where: {userId},
            include: [{
                model: Chat,
                as: 'chat'
            }, {
                model: User,
                as: 'user'
            }],
        });
    }

    async sendMessage(chatId: number, senderId: number, content: string): Promise<Message> {
        await this.validateChatUser(chatId, senderId);
        
        // Получаем последнее сообщение в чате
        const lastMessage = await this.messageModel.findOne({
            where: { chatId },
            order: [['createdAt', 'DESC']]
        });

        const message = await this.messageModel.create({chatId, senderId, content});

        // Если есть предыдущее сообщение и текущий отправитель - сотрудник,
        // отслеживаем время ответа
        if (lastMessage && lastMessage.senderId !== senderId) {
            const user = await this.userModel.findByPk(senderId);
            if (user && user.role === 'employee') {
                await this.processMetricsService.trackChatResponse(
                    chatId,
                    message.id,
                    lastMessage.senderId,
                    senderId,
                    lastMessage.createdAt,
                    message.createdAt
                );
            }
        }

        return this.messageModel.findOne({
            where: {id: message.id},
            include: [{
                model: Chat,
                as: 'chat'
            }, {
                model: User,
                as: 'user'
            }]
        });
    }

    async getChatMessages(chatId: number, userId): Promise<Message[]> {
        await this.validateChatUser(chatId, userId);
        return this.messageModel.findAll({
            where: {chatId},
            include: [{
                model: Chat,
                as: 'chat'
            }, {
                model: User,
                as: 'user'
            }],
            order: [['createdAt', 'ASC']]
        });
    }

    async updateChat(chatId: number, dto: UpdateChatDto) {
        const chat = await this.chatModel.findByPk(chatId);
        if (!chat) {
            throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND);
        }
        return this.chatModel.update(dto, {where: {id: chatId}});
    }

    async deleteChat(chatId: number): Promise<number> {
        return this.chatModel.destroy({where: {id: chatId}});
    }

    private async validateChatUser(chatId: number, userId: number) {
        const chat = await this.chatModel.findByPk(chatId);
        if (!chat) {
            throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND);
        }
        const chatParticipant = await this.chatParticipantModel.findOne({
            where: {chatId, userId},
            include: [{
                model: Chat,
                as: 'chat'
            }, {
                model: User,
                as: 'user'
            }]
        })
        if (!chatParticipant) {
            throw new HttpException('Не является участником чата', HttpStatus.NOT_FOUND);
        }
    }
}
