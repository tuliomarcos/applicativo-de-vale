export type UserRole = 'PRESTADOR_SERVICO' | 'CLIENTE' | 'EMPRESA_TERRAPLANAGEM';

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
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Prestador {
  id: string;
  name: string;
  document: string;
  documentType: 'CPF' | 'CNPJ';
  address: string;
  phone: string;
  email: string;
  createdAt: string;
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
}

export type TripType = 'ENTULHO' | 'TERRA';
export type ValeType = 'VIAGEM' | 'DIARIA';

export interface ValeBase {
  id: string;
  type: ValeType;
  clientId: string;
  client?: Client;
  workLocation: string;
  date: string;
  signatureUrl: string;
  createdById: string;
  createdAt: string;
}

export interface ValeViagem extends ValeBase {
  type: 'VIAGEM';
  truckPlate: string;
  driverName: string;
  tripType: TripType;
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
  operatorName: string;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  totalHours: number;
  equipment: string;
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
