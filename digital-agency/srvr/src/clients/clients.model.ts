import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import {ApiProperty} from "@nestjs/swagger";

interface ClientCreationAttrs {
    userId: number;
}

@Table({tableName: 'clients'})
export class Client extends Model<Client, ClientCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Яндекс', description: 'Название компании'})
    @Column({ type: DataType.STRING, allowNull: true})
    nameCompany: string;

    @ApiProperty({example: '1', description: 'ID пользователя'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, unique: true})
    userId: number;

    @BelongsTo(() => User)
    author: User;
}
