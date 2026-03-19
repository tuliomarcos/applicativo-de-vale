import { Strategy } from 'passport-jwt';
import { PrismaService } from '../database/prisma.service';
import { AuthUser, UserRoleValue } from '../types/api';
type JwtPayload = {
    sub: string;
    email: string;
    role: UserRoleValue;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<AuthUser>;
}
export {};
