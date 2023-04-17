import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { Role } from "../roles/roles.model";
import { EmployeeRoles } from "../roles/employee-roles.model";
import {ApiProperty} from "@nestjs/swagger";

interface EmployeeCreationAttrs {
    userId: number;
}

@Table({tableName: 'employees'})
export class Employee extends Model<Employee, EmployeeCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Отилчается умом и сообразительностью', description: 'Описание'})
    @Column({ type: DataType.STRING, allowNull: true})
    description: string;

    @ApiProperty({example: '1', description: 'ID пользователя'})
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, unique: true})
    userId: number;

    @BelongsTo(() => User)
    author: User;

    @BelongsToMany(() => Role, () => EmployeeRoles)
    roles: Role[];
}
