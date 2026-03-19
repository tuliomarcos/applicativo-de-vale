export type UserRoleValue = 'PRESTADOR' | 'CLIENTE' | 'EMPRESA';
export type TripTypeValue = 'ENTULHO' | 'TERRA';
export type ValeTypeValue = 'VIAGEM' | 'DIARIA';
export type DocumentTypeValue = 'CPF' | 'CNPJ';

export type AuthUser = {
  userId: string;
  email: string;
  role: UserRoleValue;
};

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRoleValue;
};

export type AuthResponse = {
  token: string;
  user: UserResponse;
};

export type MeResponse = {
  user: UserResponse;
};

export type ClientResponse = {
  id: string;
  createdById: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PrestadorResponse = {
  id: string;
  createdById: string;
  name: string;
  document: string;
  documentType: DocumentTypeValue;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

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

export type ClientSummary = Pick<
  ClientResponse,
  'id' | 'name' | 'cnpj' | 'email'
>;
export type ClientDetail = Pick<
  ClientResponse,
  'id' | 'name' | 'cnpj' | 'email' | 'address' | 'phone'
>;

export type ValeResponse = {
  id: string;
  type: ValeTypeValue;
  clientId: string;
  client: ClientSummary | ClientDetail;
  workLocation: string;
  date: Date;
  signatureUrl: string;
  createdById: string;
  createdAt: Date;
  truckPlate: string | null;
  driverName: string | null;
  tripType: TripTypeValue | null;
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
