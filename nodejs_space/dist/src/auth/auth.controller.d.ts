import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import type { AuthResponse, MeResponse, AuthUser } from '../types/api';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    getMe(user: AuthUser): Promise<MeResponse>;
}
