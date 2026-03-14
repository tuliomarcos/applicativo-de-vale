import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getMe(user: any): Promise<{
        user: any;
    }>;
}
