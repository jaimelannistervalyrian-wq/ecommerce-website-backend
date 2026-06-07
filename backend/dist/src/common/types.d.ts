export type Role = 'ADMIN' | 'USER';
export type AuthUser = {
    sub: string;
    email: string;
    role: Role;
};
