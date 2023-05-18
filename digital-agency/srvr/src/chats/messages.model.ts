import {BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Employee} from "../employees/employees.model";
import {Client} from "../clients/clients.model";
import {Chat} from "./chats.model";
import {User} from "../users/users.model";

interface MessageCreationAttrs {
    chatId: number;
    senderId: number;
    content: string;
}

@Table({tableName: 'messages'})
export class Message extends Model<Message, MessageCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    @ApiProperty({example: 'Привет', description: 'Сообщение'})
    @Column({type: DataType.STRING, allowNull: false})
    content: string;

    @ForeignKey(() => Chat)
    @Column({ type: DataType.INTEGER, allowNull: false })
    chatId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    senderId: number;

    @BelongsTo(() => Chat)
    chat: Chat;

    @BelongsTo(() => User)
    user: User;
}
