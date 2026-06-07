import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

/**
 * Global JWT module — registered once, available everywhere.
 * JwtService, JwtAuthGuard and RolesGuard are available in every module.
 */
@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                // Only set the secret here — expiresIn is passed per-call in signAsync
                secret: config.get<string>('JWT_ACCESS_SECRET') ?? 'dev-access-secret',
            }),
        }),
    ],
    providers: [JwtAuthGuard, RolesGuard],
    exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class SharedJwtModule { }
