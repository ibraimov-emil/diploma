import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {Chat} from "./chats.model";
import {User} from "../users/users.model";
import {Message} from "./messages.model";
import {ChatParticipant} from "./chat-participants.model";
import {UpdateChatDto} from "./dto/update-chat.dto";


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
    ) {}


    async createChat(name: string, creatorId: number): Promise<Chat> {
        const chat = await this.chatModel.create({ name, creatorId });
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
        const chatParticipan = await this.chatParticipantModel.findOne({where: {chatId, userId}, include: {all: true}})
        if (chatParticipan){
            throw new HttpException('Уже является участником чата', HttpStatus.NOT_FOUND);
        }
        return this.chatParticipantModel.create({
            chatId,
            userId,
        });
    }

    async getChatParticipants(chatId: number): Promise<User[]> {
        return this.userModel.findAll({
            include: [
                {
                    model: ChatParticipant,
                    where: { chatId },
                },
            ],
        });
    }

    async sendMessage(chatId: number, senderId: number, content: string): Promise<Message> {
        const chat = await this.chatModel.findByPk(chatId);
        if (!chat){
            throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND);
        }

        const chatParticipan = await this.chatParticipantModel.findOne({where: {chatId, userId: senderId}, include: {all: true}})
        if (!chatParticipan){
            throw new HttpException('Не является участником чата', HttpStatus.NOT_FOUND);
        }

        return this.messageModel.create({ chatId, senderId, content });
    }

    async getChatMessages(chatId: number): Promise<Message[]> {
        return this.messageModel.findAll({ where: { chatId } });
    }

    async updateChat(chatId: number, dto: UpdateChatDto){
        const chat = await this.chatModel.findByPk(chatId);
        if (!chat){
            throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND);
        }
        return this.chatModel.update(dto, { where: { id: chatId } });
    }

    async deleteChat(chatId: number): Promise<number> {
        return this.chatModel.destroy({ where: { id: chatId } });
    }
}