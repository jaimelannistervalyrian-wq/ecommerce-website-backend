import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import type { AuthUser } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();

        // Support both Authorization header and cookie
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null;

        if (!token) {
            throw new UnauthorizedException('Missing access token');
        }

        try {
            const secret = this.config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret');
            req.user = this.jwtService.verify<AuthUser>(token, { secret });
            return true;
        } catch (err: any) {
            if (err?.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Access token expired');
            }
            throw new UnauthorizedException('Invalid access token');
        }
    }
}
