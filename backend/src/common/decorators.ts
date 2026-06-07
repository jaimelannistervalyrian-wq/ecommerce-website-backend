import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import type { AuthUser } from './types';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('ADMIN' | 'USER')[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): AuthUser => {
        const req = ctx.switchToHttp().getRequest<Request & { user: AuthUser }>();
        return req.user;
    },
);
