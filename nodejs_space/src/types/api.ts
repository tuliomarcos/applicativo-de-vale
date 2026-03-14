import {
  Client,
  DocumentType,
  Empresa,
  Prestador,
  TripType,
  User,
  UserRole,
  ValeType,
} from '@prisma/client';

export type AuthUser = {
  userId: string;
  email: string;
  role: UserRole;
};

export type UserResponse = Pick<User, 'id' | 'email' | 'name' | 'phone' | 'role'>;

export type AuthResponse = {
  token: string;
  user: UserResponse;
};

export type MeResponse = {
  user: UserResponse;
};

export type ClientResponse = Client;

export type PrestadorResponse = Prestador;

export type EmpresaResponse = {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  userId: string;
  createdAt: Date;
};

export type ClientSummary = Pick<Client, 'id' | 'name' | 'cnpj' | 'email'>;
export type ClientDetail = Pick<
  Client,
  'id' | 'name' | 'cnpj' | 'email' | 'address' | 'phone'
>;

export type ValeResponse = {
  id: string;
  type: ValeType;
  clientId: string;
  client: ClientSummary | ClientDetail;
  workLocation: string;
  date: Date;
  signatureUrl: string;
  createdById: string;
  createdAt: Date;
  truckPlate: string | null;
  driverName: string | null;
  tripType: TripType | null;
  operatorName: string | null;
  morningStart: string | null;
  morningEnd: string | null;
  afternoonStart: string | null;
  afternoonEnd: string | null;
  totalHours: number | null;
  equipment: string | null;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
};

export type DashboardStatsResponse = {
  totalVales: number;
  totalClients: number;
  recentVales: ValeResponse[];
};

export type PresignedUploadResponse = {
  uploadUrl: string;
  cloud_storage_path: string;
};

export type CompleteUploadResponse = {
  id: string;
  cloud_storage_path: string;
  url: string;
};

export type MultipartInitResponse = {
  uploadId: string;
  cloud_storage_path: string;
};

export type PartUrlResponse = {
  url: string;
};

export type FileUrlResponse = {
  url: string;
};

export type PdfResponse = {
  pdfUrl: string;
};

export type ShareLinkResponse = {
  pdfUrl: string;
  whatsappUrl: string;
};

export type SendEmailResponse = {
  success: boolean;
  message?: string;
};

export type SuccessResponse = {
  success: true;
};

export type DocumentTypeValue = DocumentType;
export type TripTypeValue = TripType;
export type ValeTypeValue = ValeType;
export type UserRoleValue = UserRole;
