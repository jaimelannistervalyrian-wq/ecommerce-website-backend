import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    getMe(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true,
            },
        });
    }

    getAddresses(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    }

    addAddress(
        userId: string,
        input: {
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
        return this.prisma.$transaction(async (tx) => {
            if (input.isDefault) {
                await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
            }
            return tx.address.create({
                data: {
                    userId,
                    line1: input.line1,
                    line2: input.line2,
                    city: input.city,
                    state: input.state,
                    postalCode: input.postalCode,
                    country: input.country,
                    phone: input.phone,
                    isDefault: Boolean(input.isDefault),
                },
            });
        });
    }
}
