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
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private readonly employeeService: EmployeesService,
                private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            if (!requiredRoles) {
                return true;
            }
            // console.log('rolesguard')

            const req = context.switchToHttp().getRequest();

            const authHeader = req.headers.authorization;

            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }
            // const payload = this.jwtService.verify(token);
            // console.log(token)
            const user = this.jwtService.verify(token);

            req.user = user;
            const employeeId = user.employee.id
            if(!employeeId){
                return false
            }

            const employee = await this.employeeService.findOneById(user.employee.id);
            // console.log(employee.roles.some(role => requiredRoles.includes(role.value)))
            return employee.roles.some(role => requiredRoles.includes(role.value));

        } catch (e) {
            console.log(e)
            throw new HttpException( 'Нет доступа', HttpStatus.FORBIDDEN)
        }
    }

}
