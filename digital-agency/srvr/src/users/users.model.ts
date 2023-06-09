import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    HasOne,
    Model,
    Table
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Employee} from "../employees/employees.model";
import {Client} from "../clients/clients.model";
import {Chat} from "../chats/chats.model";
import {ChatParticipant} from "../chats/chat-participants.model";

interface UserCreationAttrs {
    surname: string;
    name: string;
    email: string;
    password: string;
    phone: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    @ApiProperty({example: 'admin@admin.ru', description: 'Почтовый адрес'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;
    @ApiProperty({example: '12345', description: 'Пароль'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: '+79797979', description: 'Телефон'})
    @Column({type: DataType.STRING, allowNull: false})
    phone: string;

    @ApiProperty({example: 'Ибраимов', description: 'Фамилия'})
    @Column({type: DataType.STRING, allowNull: false})
    surname: string;

    @ApiProperty({example: 'Эмиль', description: 'Имя'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: '02.04.2002', description: 'Дата рождения'})
    @Column({type: DataType.DATE, allowNull: true})
    happyBirthday: Date;

    @ApiProperty({example: 'true', description: 'Забанен или нет'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'За хулиганство', description: 'Причина блокировки'})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @ApiProperty({example: 'Токен', description: 'Рефреш'})
    @Column({type: DataType.STRING})
    refreshToken: any;

    @ApiProperty({example: 'file.jpg', description: 'Аватар пользователя'})
    @Column({type: DataType.STRING})
    avatar: string;

    @HasOne(() => Employee)
    employee: Employee;

    @HasOne(() => Client)
    client: Client;

    @BelongsToMany(() => Chat, () => ChatParticipant)
    chats: Chat[];
}
