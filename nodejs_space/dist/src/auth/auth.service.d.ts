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
            id: any;
            email: any;
            name: any;
            phone: any;
            role: any;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            role: any;
        };
    }>;
    getMe(userId: string): Promise<{
        user: any;
    }>;
}
