import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Role} from "./roles.model";
import {Employee} from "../employees/employees.model";


@Table({tableName: 'employee_roles', createdAt: false, updatedAt: false})
export class EmployeeRoles extends Model<EmployeeRoles> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER})
    roleId: number;

    @ForeignKey(() => Employee)
    @Column({type: DataType.INTEGER, onDelete: 'CASCADE'})
    employeeId: number;
}
