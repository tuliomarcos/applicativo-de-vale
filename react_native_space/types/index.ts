export type UserRole = 'PRESTADOR' | 'CLIENTE' | 'EMPRESA';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Client {
  id: string;
  createdById: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prestador {
  id: string;
  createdById: string;
  name: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Empresa {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export type TripType = 'ENTULHO' | 'TERRA';
export type ValeType = 'VIAGEM' | 'DIARIA';

export type ClientSummary = Pick<Client, 'id' | 'name' | 'cnpj' | 'email'>;
export type ClientDetail = Pick<
  Client,
  'id' | 'name' | 'cnpj' | 'email' | 'address' | 'phone'
>;

export interface ValeBase {
  id: string;
  type: ValeType;
  clientId: string;
  client: ClientSummary | ClientDetail;
  workLocation: string;
  date: string;
  signatureUrl: string;
  createdById: string;
  createdAt: string;
}

export interface ValeViagem extends ValeBase {
  type: 'VIAGEM';
  truckPlate: string | null;
  driverName: string | null;
  tripType: TripType | null;
  operatorName: null;
  morningStart: null;
  morningEnd: null;
  afternoonStart: null;
  afternoonEnd: null;
  totalHours: null;
  equipment: null;
}

export interface ValeDiaria extends ValeBase {
  type: 'DIARIA';
  operatorName: string | null;
  morningStart: string | null;
  morningEnd: string | null;
  afternoonStart: string | null;
  afternoonEnd: string | null;
  totalHours: number | null;
  equipment: string | null;
  truckPlate: null;
  driverName: null;
  tripType: null;
}

export type Vale = ValeViagem | ValeDiaria;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DashboardStats {
  totalVales: number;
  totalClients: number;
  recentVales: Vale[];
}

export interface SignupPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CreateClientPayload {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

export interface CreatePrestadorPayload {
  name: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  address: string;
  phone: string;
  email: string;
}

export interface CreateEmpresaPayload {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface CreateValeViagemPayload {
  clientId: string;
  truckPlate: string;
  driverName: string;
  tripType: TripType;
  workLocation: string;
  date: string;
  signatureData: string;
}

export interface CreateValeDiariaPayload {
  clientId: string;
  operatorName: string;
  workLocation: string;
  date: string;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  totalHours: number;
  equipment: string;
  signatureData: string;
}

export interface UpdateValePayload {
  workLocation?: string;
  truckPlate?: string;
  driverName?: string;
  tripType?: TripType;
  operatorName?: string;
  morningStart?: string;
  morningEnd?: string;
  afternoonStart?: string;
  afternoonEnd?: string;
  totalHours?: number;
  equipment?: string;
}
