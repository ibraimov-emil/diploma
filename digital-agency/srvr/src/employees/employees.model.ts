import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { Role } from "../roles/roles.model";
import { EmployeeRoles } from "../roles/employee-roles.model";
import {ApiProperty} from "@nestjs/swagger";
import {Project} from "../projects/projects.model";
import {EmployeesProjects} from "../projects/employees-projects.model";
import { Task } from "src/tasks/tasks.model";
import { EmployeesTasks } from "src/tasks/employees-tasks.model";

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
    @Column({type: DataType.INTEGER, unique: true, onDelete: 'CASCADE'})
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => Role, () => EmployeeRoles)
    roles: Role[];

    @BelongsToMany(() => Project, () => EmployeesProjects)
    projects: Project[];

    @BelongsToMany(() => Task, () => EmployeesTasks)
    tasks: Task[];
}
