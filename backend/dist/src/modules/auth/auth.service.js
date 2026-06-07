"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signUp(input) {
        const exists = await this.prisma.user.findUnique({ where: { email: input.email } });
        if (exists)
            throw new common_1.BadRequestException('Email already registered');
        const passwordHash = await bcrypt.hash(input.password, 10);
        const user = await this.prisma.user.create({
            data: { email: input.email, fullName: input.fullName, passwordHash },
        });
        return this.issueTokens(user.id, user.email, user.role);
    }
    async login(input) {
        const user = await this.prisma.user.findUnique({ where: { email: input.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return this.issueTokens(user.id, user.email, user.role);
    }
    async refresh(refreshToken) {
        try {
            const secret = this.config.get('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
            const payload = this.jwt.verify(refreshToken, { secret });
            return this.issueTokens(payload.sub, payload.email, payload.role);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async forgotPassword(email) {
        await this.prisma.user.findUnique({ where: { email } });
        return { message: 'If that email exists, reset instructions have been sent.' };
    }
    async resetPassword(input) {
        const user = await this.prisma.user.findUnique({ where: { email: input.email } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const passwordHash = await bcrypt.hash(input.newPassword, 10);
        await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
        return { message: 'Password updated successfully' };
    }
    async issueTokens(userId, email, role) {
        const accessSecret = this.config.get('JWT_ACCESS_SECRET') ?? 'dev-access-secret';
        const refreshSecret = this.config.get('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, { secret: accessSecret, expiresIn: '7d' }),
            this.jwt.signAsync(payload, { secret: refreshSecret, expiresIn: '30d' }),
        ]);
        return { accessToken, refreshToken, user: { id: userId, email, role } };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map