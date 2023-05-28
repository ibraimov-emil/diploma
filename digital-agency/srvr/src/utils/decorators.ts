import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {User} from "../users/users.model";


interface AuthenticatedRequest extends Request {
    user: User;
}

// export const AuthUser = createParamDecorator(
//     (_:unknown, ctx: ExecutionContext): number | null => {
//         const request = ctx.switchToHttp().getRequest()
//         // console.log(request)
//         return request.user?.id ? Number(request.user.id) : null
//     }
// );

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = <AuthenticatedRequest>ctx.switchToHttp().getRequest();

        // console.log('request.headers')
        // console.log(request)
        return request.user;
    },
);