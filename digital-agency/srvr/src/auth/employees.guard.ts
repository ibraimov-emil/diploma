import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";
import {EmployeesService} from "../employees/employees.service";

@Injectable()
export class EmployeesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private readonly employeeService: EmployeesService,
                private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
    // async canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
                const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                    context.getHandler(),
                    context.getClass(),
                ])
                if (!requiredRoles) {
                    return true;
                }
                console.log('test')

                const req = context.switchToHttp().getRequest();

                const authHeader = req.headers.authorization;
                const bearer = authHeader.split(' ')[0]
                const token = authHeader.split(' ')[1]

                if (bearer !== 'Bearer' || !token) {
                    throw new UnauthorizedException({message: 'Пользователь не авторизован'})
                }
                // const payload = this.jwtService.verify(token);

                const user = this.jwtService.verify(token);
                req.user = user;
                const employeeId = user.employee.id
                if(!employeeId){
                    return false
                }

                const employee = await this.employeeService.findOneById(user.employee.id);
                return employee.roles.some(role => requiredRoles.includes(role.value));

        } catch (e) {
            console.log(e)
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN)
        }
    }

}




// const employee = employee.roles.some(role => requiredRoles.includes(role.value));
// const bol = user.findOne({ where: { id: payload.id }, include: { model: Employee } });
// console.log(role)

// const employeeId = user

// const employee = this.userService.findEmployeeByUserId(user.id, {
//     include: [{ model: Role, through: { attributes: [] } }]
// });

// const employee = Employee.findOne({ where: { userId: user.id }, include: ['roles'] });
// req.employee = employee;
// console.log(employee.roles)

// const employeeRoles = await user.getEmployee()?.getRoles();
// console.log(token)

// if (!employeeId) {
//     return false;
// }
//
// const employeeRoles = employee.roles.map((role) => role.value);
// return requiredRoles.every((role) => employeeRoles.includes(role));

// const employeeRoles = employee.roles;

// const roles = user?.employee?.roles || [];


// const employeeRoles = employee.$get('roles');
// const employeeRoleValues = employeeRoles.map((role) => role.value);
// return requiredRoles.every((role) => employeeRoleValues.includes(role));


// if (!(user instanceof User) || !(user.employee instanceof Employee) || !user.employee.roles) {
//     return false;
// }
// const hasRole = () => user.employee.roles.some((role: Role) => requiredRoles.includes(role.value));
// return user && user.employee && hasRole();

// const user = this.jwtService.verify(token);
// req.user = user;
// console.log(user)
// return false
// return employee.roles.some(role => requiredRoles.includes(role.value));