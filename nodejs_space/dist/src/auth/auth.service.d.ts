import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    getMe(userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
}
