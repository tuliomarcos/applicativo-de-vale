declare enum UserRole {
    PRESTADOR = "PRESTADOR",
    CLIENTE = "CLIENTE",
    EMPRESA = "EMPRESA"
}
export declare class SignupDto {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: UserRole;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export {};
