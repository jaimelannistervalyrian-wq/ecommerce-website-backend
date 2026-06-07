import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    signUp(@Body() body: { email: string; password: string; fullName: string }) {
        return this.authService.signUp(body);
    }

    @Post('login')
    login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body);
    }

    @Post('refresh')
    refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refresh(body.refreshToken);
    }

    @Post('forgot-password')
    forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email);
    }

    @Post('reset-password')
    resetPassword(@Body() body: { email: string; newPassword: string }) {
        return this.authService.resetPassword(body);
    }
}
