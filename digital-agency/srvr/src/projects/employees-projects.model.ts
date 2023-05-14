import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Employee} from "../employees/employees.model";
import {Project} from "./projects.model";

// interface EmployeesProjectsCreationAttrs {
//     projectId: number;
//     employeeId: number;
// }

@Table({tableName: 'employees_projects'})
export class EmployeesProjects extends Model<EmployeesProjects> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Project)
    @Column({type: DataType.INTEGER})
    projectId: number;

    @ForeignKey(() => Employee)
    @Column({type: DataType.INTEGER, onDelete: 'CASCADE'})
    employeeId: number;
    //
    // @BelongsToMany(() => Role, () => EmployeeRoles)
    // roles: Role[];
}
