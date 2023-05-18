import {BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Employee} from "../employees/employees.model";
import {Client} from "../clients/clients.model";
import {User} from "../users/users.model";
import {Chat} from "./chats.model";

interface ChatCreationAttrs {
    surname: string;
    name: string;
    email: string;
    password: string;
    phone: string;
}

@Table({tableName: 'chat_participants'})
export class ChatParticipant extends Model<ChatParticipant> {
    @ForeignKey(() => Chat)
    @Column({ type: DataType.INTEGER })
    chatId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;
}
