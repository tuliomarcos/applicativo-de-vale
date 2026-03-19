import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { AuthResponse, MeResponse } from '../types/api';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(signupDto: SignupDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    getMe(userId: string): Promise<MeResponse>;
}
