export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: ("ADMIN" | "USER")[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
