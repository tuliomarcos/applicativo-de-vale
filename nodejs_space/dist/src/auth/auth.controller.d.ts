import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getMe(user: any): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
}
