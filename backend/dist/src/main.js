"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.enableCors({ origin: true, credentials: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    const swagger = new swagger_1.DocumentBuilder()
        .setTitle('SS Jeweleries API')
        .setDescription('Production-ready luxury jewelry e-commerce REST API')
        .setVersion('2.0')
        .addBearerAuth()
        .addTag('Auth', 'Authentication & authorization')
        .addTag('Products', 'Product catalog')
        .addTag('Categories', 'Product categories')
        .addTag('Cart', 'Shopping cart management')
        .addTag('Wishlist', 'Wishlist management')
        .addTag('Orders', 'Order management')
        .addTag('Users', 'User profile & addresses')
        .addTag('Banners', 'CMS banners')
        .addTag('Admin', 'Admin-only operations')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swagger);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const prisma = app.get(prisma_service_1.PrismaService);
    await prisma.enableShutdownHooks(app);
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 SS Jeweleries API running on http://localhost:${port}/api`);
    console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map