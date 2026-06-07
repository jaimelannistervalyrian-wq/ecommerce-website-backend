import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    async signUp(input: { email: string; password: string; fullName: string }) {
        const exists = await this.prisma.user.findUnique({ where: { email: input.email } });
        if (exists) throw new BadRequestException('Email already registered');
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await this.prisma.user.create({
            data: { email: input.email, fullName: input.fullName, passwordHash },
        });
        return this.issueTokens(user.id, user.email, user.role);
    }

    async login(input: { email: string; password: string }) {
        const user = await this.prisma.user.findUnique({ where: { email: input.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        return this.issueTokens(user.id, user.email, user.role);
    }

    async refresh(refreshToken: string) {
        try {
            const secret = this.config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
            const payload = this.jwt.verify<{ sub: string; email: string; role: 'ADMIN' | 'USER' }>(
                refreshToken,
                { secret },
            );
            return this.issueTokens(payload.sub, payload.email, payload.role);
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async forgotPassword(email: string) {
        await this.prisma.user.findUnique({ where: { email } });
        return { message: 'If that email exists, reset instructions have been sent.' };
    }

    async resetPassword(input: { email: string; newPassword: string }) {
        const user = await this.prisma.user.findUnique({ where: { email: input.email } });
        if (!user) throw new NotFoundException('User not found');
        const passwordHash = await bcrypt.hash(input.newPassword, 10);
        await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
        return { message: 'Password updated successfully' };
    }

    private async issueTokens(userId: string, email: string, role: 'ADMIN' | 'USER') {
        const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET') ?? 'dev-access-secret';
        const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
        const payload = { sub: userId, email, role };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, { secret: accessSecret, expiresIn: '7d' as any }),
            this.jwt.signAsync(payload, { secret: refreshSecret, expiresIn: '30d' as any }),
        ]);

        return { accessToken, refreshToken, user: { id: userId, email, role } };
    }
}
