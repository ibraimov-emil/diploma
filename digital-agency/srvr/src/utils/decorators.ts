import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {User} from "../users/users.model";


interface AuthenticatedRequest extends Request {
    user: User;
}

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = <AuthenticatedRequest>ctx.switchToHttp().getRequest();
        return request.user;
    },
);