import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {Message} from "./messages.model";
import {ChatParticipant} from "./chat-participants.model";

interface ChatCreationAttrs {
    name: string;
    creatorId: number;
}

@Table({tableName: 'chats'})
export class Chat extends Model<Chat, ChatCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Заявка №31', description: 'Название чата'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    creatorId: number;

    @BelongsTo(() => User)
    creator: User;

    @BelongsToMany(() => User, () => ChatParticipant)
    participants: User[];

    @HasMany(() => Message)
    messages: Message[];
}
