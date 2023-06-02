import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Employee} from "../employees/employees.model";
import { Task } from "./tasks.model";

@Table({tableName: 'employees_tasks'})
export class EmployeesTasks extends Model<EmployeesTasks> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Task)
    @Column({type: DataType.INTEGER})
    taskId: number;

    @ForeignKey(() => Employee)
    @Column({type: DataType.INTEGER, onDelete: 'CASCADE'})
    employeeId: number;
    //
    // @BelongsToMany(() => Role, () => EmployeeRoles)
    // roles: Role[];
}
