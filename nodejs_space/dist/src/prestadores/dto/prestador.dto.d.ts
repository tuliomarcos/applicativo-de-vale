declare enum DocumentType {
    CPF = "CPF",
    CNPJ = "CNPJ"
}
export declare class CreatePrestadorDto {
    name: string;
    document: string;
    documentType: DocumentType;
    address: string;
    phone: string;
    email: string;
}
export declare class UpdatePrestadorDto {
    name?: string;
    document?: string;
    documentType?: DocumentType;
    address?: string;
    phone?: string;
    email?: string;
}
export {};
