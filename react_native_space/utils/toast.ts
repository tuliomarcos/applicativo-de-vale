import Toast from 'react-native-toast-message';
import { AxiosError } from 'axios';

export const showToast = {
  success: (message: string) => {
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },
  error: (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  },
  info: (message: string) => {
    Toast.show({
      type: 'info',
      text1: 'Informação',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },
};

// Mapeamento de erros do backend para mensagens amigáveis
export const errorMessages: { [key: string]: string } = {
  // Erros de autenticação
  'User already exists': 'Este email já está cadastrado',
  'Email already exists': 'Este email já está cadastrado',
  'Invalid credentials': 'Email ou senha incorretos',
  'Unauthorized': 'Você não tem permissão para esta ação',
  'Token expired': 'Sua sessão expirou. Faça login novamente',
  'Invalid token': 'Sessão inválida. Faça login novamente',
  
  // Erros de validação
  'Validation failed': 'Dados inválidos. Verifique os campos',
  'Email must be an email': 'Email inválido',
  'Password too short': 'A senha deve ter pelo menos 6 caracteres',
  'Name is required': 'Nome é obrigatório',
  'Email is required': 'Email é obrigatório',
  'Password is required': 'Senha é obrigatória',
  'CNPJ is required': 'CNPJ é obrigatório',
  'CPF is required': 'CPF é obrigatório',
  
  // Erros de empresa
  'Company not found': 'Empresa não encontrada',
  'Company already exists': 'Empresa já cadastrada',
  'CNPJ already exists': 'CNPJ já cadastrado',
  'Logo is required': 'Logo é obrigatório',
  
  // Erros de cliente
  'Client not found': 'Cliente não encontrado',
  'Client already exists': 'Cliente já cadastrado',
  
  // Erros de prestador
  'Service provider not found': 'Prestador não encontrado',
  'Service provider already exists': 'Prestador já cadastrado',
  
  // Erros de vales
  'Voucher not found': 'Vale não encontrado',
  'Invalid voucher type': 'Tipo de vale inválido',
  'Client is required': 'Cliente é obrigatório',
  'Signature is required': 'Assinatura é obrigatória',
  'Date is required': 'Data é obrigatória',
  
  // Erros gerais
  'Internal server error': 'Erro no servidor. Tente novamente',
  'Network Error': 'Erro de conexão. Verifique sua internet',
  'Bad Request': 'Requisição inválida',
  'Not Found': 'Recurso não encontrado',
  'Forbidden': 'Acesso negado',
};

// Mapeamento de sucessos
export const successMessages = {
  // Autenticação
  signup: 'Conta criada com sucesso!',
  login: 'Login realizado com sucesso!',
  logout: 'Logout realizado com sucesso!',
  
  // Empresa
  createCompany: 'Empresa cadastrada com sucesso!',
  updateCompany: 'Empresa atualizada com sucesso!',
  deleteCompany: 'Empresa excluída com sucesso!',
  
  // Cliente
  createClient: 'Cliente cadastrado com sucesso!',
  updateClient: 'Cliente atualizado com sucesso!',
  deleteClient: 'Cliente excluído com sucesso!',
  
  // Prestador
  createServiceProvider: 'Prestador cadastrado com sucesso!',
  updateServiceProvider: 'Prestador atualizado com sucesso!',
  deleteServiceProvider: 'Prestador excluído com sucesso!',
  
  // Vales
  createVoucher: 'Vale criado com sucesso!',
  updateVoucher: 'Vale atualizado com sucesso!',
  deleteVoucher: 'Vale excluído com sucesso!',
  sendEmail: 'Email enviado com sucesso!',
  shareWhatsapp: 'Compartilhado via WhatsApp!',
};

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

export const getErrorMessage = (error: unknown): string => {
  // Se for uma string simples
  if (typeof error === 'string') {
    return errorMessages[error] || error;
  }
  
  // Se for um objeto de erro com response do axios
  if (error && typeof error === 'object' && (error as AxiosError).response?.data) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const data = axiosError.response?.data;
    
    // Verificar se tem mensagem específica
    if (data.message) {
      if (Array.isArray(data.message)) {
        return errorMessages[data.message[0]] || data.message[0];
      }
      return errorMessages[data.message] || data.message;
    }
    
    // Verificar se tem erro específico
    if (data.error) {
      return errorMessages[data.error] || data.error;
    }
  }
  
  // Se for erro de rede
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message?: unknown }).message);
    return errorMessages[message] || message;
  }
  
  // Mensagem padrão
  return 'Ocorreu um erro. Tente novamente';
};
