import { PrismaService } from '../../prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        role: import("@prisma/client").$Enums.Role;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getAddresses(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    addAddress(userId: string, input: {
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
