import { UsersService } from './users.service';
import type { AuthUser } from '../../common/types';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: AuthUser): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        role: import("@prisma/client").$Enums.Role;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getAddresses(user: AuthUser): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string | null;
        isDefault: boolean;
    }[]>;
    addAddress(user: AuthUser, body: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone?: string;
        isDefault?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        line1: string;
        line2: string | null;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string | null;
        isDefault: boolean;
    }>;
}
