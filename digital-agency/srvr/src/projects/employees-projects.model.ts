import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Service} from "../services/services.model";
import {Client} from "../clients/clients.model";
import {Status} from "../statuses/statuses.model";
import {RequestTable} from "../requests/requests.model";
import {User} from "../users/users.model";
import {Stage} from "../stages/stage.model";
import {Role} from "../roles/roles.model";
import {Employee} from "../employees/employees.model";

// interface EmployeesProjectsCreationAttrs {
//     projectId: number;
//     employeeId: number;
// }

@Table({tableName: 'projects'})
export class EmployeesProjects extends Model<EmployeesProjects> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER})
    projectId: number;

    @ForeignKey(() => Employee)
    @Column({type: DataType.INTEGER, onDelete: 'CASCADE'})
    employeeId: number;



    //
    // @BelongsToMany(() => Role, () => EmployeeRoles)
    // roles: Role[];
}
