import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import type { AuthUser } from '../../common/types';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getMe(@CurrentUser() user: AuthUser) {
        return this.usersService.getMe(user.sub);
    }

    @Get('me/addresses')
    getAddresses(@CurrentUser() user: AuthUser) {
        return this.usersService.getAddresses(user.sub);
    }

    @Post('me/addresses')
    addAddress(
        @CurrentUser() user: AuthUser,
        @Body()
        body: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            phone?: string;
            isDefault?: boolean;
        },
    ) {
        return this.usersService.addAddress(user.sub, body);
    }
}
