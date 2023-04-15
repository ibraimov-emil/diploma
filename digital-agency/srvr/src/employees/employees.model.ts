import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { Role } from "../roles/roles.model";
import { EmployeeRoles } from "../roles/employee-roles.model";

interface EmployeeCreationAttrs {
    userId: number;
}

@Table({tableName: 'users'})
export class Employee extends Model<Employee, EmployeeCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    @Column({ type: DataType.STRING, allowNull: true})
    description: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsToMany(() => Role, () => EmployeeRoles)
    roles: Role[];
}
