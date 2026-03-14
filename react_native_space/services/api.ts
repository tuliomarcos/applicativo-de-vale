import axios, { AxiosInstance, AxiosError } from 'axios';
import { storage } from './storage';
import {
  AuthResponse,
  User,
  Client,
  Prestador,
  Empresa,
  Vale,
  PaginatedResponse,
  DashboardStats,
  SignupPayload,
  CreateClientPayload,
  CreatePrestadorPayload,
  CreateEmpresaPayload,
  CreateValeViagemPayload,
  CreateValeDiariaPayload,
  UpdateValePayload,
} from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://a9ee74b78.na106.preview.abacusai.app';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: new URL('/api', API_URL).toString(),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await storage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await storage.clear();
          // Navigation will be handled by AuthContext
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async signup(data: SignupPayload): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/signup', data);
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  }

  async getMe(): Promise<{ user: User }> {
    const response = await this.client.get<{ user: User }>('/auth/me');
    return response.data;
  }

  // Clients
  async createClient(data: CreateClientPayload): Promise<Client> {
    const response = await this.client.post<Client>('/clients', data);
    return response.data;
  }

  async getClients(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Client>> {
    const response = await this.client.get<PaginatedResponse<Client>>('/clients', { params });
    return response.data;
  }

  async getClient(id: string): Promise<Client> {
    const response = await this.client.get<Client>(`/clients/${id}`);
    return response.data;
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const response = await this.client.patch<Client>(`/clients/${id}`, data);
    return response.data;
  }

  async deleteClient(id: string): Promise<void> {
    await this.client.delete(`/clients/${id}`);
  }

  // Prestadores
  async createPrestador(data: CreatePrestadorPayload): Promise<Prestador> {
    const response = await this.client.post<Prestador>('/prestadores', data);
    return response.data;
  }

  async getPrestadores(params?: { search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Prestador>> {
    const response = await this.client.get<PaginatedResponse<Prestador>>('/prestadores', { params });
    return response.data;
  }

  async getPrestador(id: string): Promise<Prestador> {
    const response = await this.client.get<Prestador>(`/prestadores/${id}`);
    return response.data;
  }

  async updatePrestador(id: string, data: Partial<Prestador>): Promise<Prestador> {
    const response = await this.client.patch<Prestador>(`/prestadores/${id}`, data);
    return response.data;
  }

  async deletePrestador(id: string): Promise<void> {
    await this.client.delete(`/prestadores/${id}`);
  }

  // Empresa
  async createEmpresa(data: CreateEmpresaPayload): Promise<Empresa> {
    const response = await this.client.post<Empresa>('/empresa', data);
    return response.data;
  }

  async getEmpresa(): Promise<Empresa | null> {
    try {
      const response = await this.client.get<Empresa>('/empresa');
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async updateEmpresa(id: string, data: Partial<Empresa>): Promise<Empresa> {
    const response = await this.client.patch<Empresa>(`/empresa/${id}`, data);
    return response.data;
  }

  // File Upload
  async getPresignedUrl(fileName: string, contentType: string, isPublic: boolean = true): Promise<{ uploadUrl: string; cloud_storage_path: string }> {
    const response = await this.client.post('/upload/presigned', {
      fileName,
      contentType,
      isPublic,
    });
    return response.data;
  }

  async uploadFileToS3(uploadUrl: string, file: Blob, contentType: string): Promise<void> {
    // Check if Content-Disposition is required in signed headers
    const url = new URL(uploadUrl);
    const signedHeaders = url.searchParams.get('X-Amz-SignedHeaders');
    const requiresContentDisposition = signedHeaders?.includes('content-disposition');

    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    if (requiresContentDisposition) {
      headers['Content-Disposition'] = 'attachment';
    }

    await axios.put(uploadUrl, file, { headers });
  }

  async completeUpload(cloudStoragePath: string, empresaId: string): Promise<{ id: string; cloud_storage_path: string; url: string }> {
    const response = await this.client.post('/upload/complete', {
      cloud_storage_path: cloudStoragePath,
      empresaId,
    });
    return response.data;
  }

  async getFileUrl(fileId: string, mode: 'view' | 'download' = 'view'): Promise<{ url: string }> {
    const response = await this.client.get(`/files/${fileId}/url`, {
      params: { mode },
    });
    return response.data;
  }

  // Vales
  async createValeViagem(data: CreateValeViagemPayload): Promise<Vale> {
    const response = await this.client.post<Vale>('/vales/viagem', data);
    return response.data;
  }

  async createValeDiaria(data: CreateValeDiariaPayload): Promise<Vale> {
    const response = await this.client.post<Vale>('/vales/diaria', data);
    return response.data;
  }

  async getVales(params?: { type?: 'VIAGEM' | 'DIARIA'; search?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Vale>> {
    const response = await this.client.get<PaginatedResponse<Vale>>('/vales', { params });
    return response.data;
  }

  async getVale(id: string): Promise<Vale> {
    const response = await this.client.get<Vale>(`/vales/${id}`);
    return response.data;
  }

  async updateVale(id: string, data: UpdateValePayload): Promise<Vale> {
    const response = await this.client.patch<Vale>(`/vales/${id}`, data);
    return response.data;
  }

  async deleteVale(id: string): Promise<void> {
    await this.client.delete(`/vales/${id}`);
  }

  async generatePDF(valeIds: string[]): Promise<{ pdfUrl: string }> {
    const response = await this.client.post<{ pdfUrl: string }>('/vales/pdf', { valeIds });
    return response.data;
  }

  async sendEmail(valeIds: string[], recipientEmail: string): Promise<{ success: boolean }> {
    const response = await this.client.post<{ success: boolean }>('/vales/send-email', {
      valeIds,
      recipientEmail,
    });
    return response.data;
  }

  async getShareLink(valeIds: string[]): Promise<{ pdfUrl: string; whatsappUrl: string }> {
    const response = await this.client.post<{ pdfUrl: string; whatsappUrl: string }>('/vales/share-link', {
      valeIds,
    });
    return response.data;
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }
}

export const api = new ApiService();
