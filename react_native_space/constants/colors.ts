/**
 * Sistema de Cores - TerraVale App
 * 
 * Este arquivo centraliza todas as cores usadas no aplicativo.
 * Para trocar o esquema de cores, basta modificar os valores aqui.
 */

export const ColorSchemes = {
  dark: {
    // === CORES PRINCIPAIS ===
    primary: '#7C3AED',        // Roxo vibrante - cor principal do app
    secondary: '#EC4899',      // Rosa - cor secundária/accent
    
    // === BACKGROUNDS ===
    background: '#0A0A0A',     // Fundo principal (quase preto)
    surface: '#1A1A1A',        // Superfície de cards/modais
    surfaceVariant: '#262626', // Superfície alternativa (mais clara)
    
    // === TEXTOS ===
    text: '#FFFFFF',           // Texto principal (branco)
    textSecondary: '#A3A3A3',  // Texto secundário (cinza claro)
    textTertiary: '#737373',   // Texto terciário (cinza médio)
    textDisabled: '#525252',   // Texto desabilitado (cinza escuro)
    
    // === BORDAS ===
    border: '#262626',         // Bordas padrão
    borderLight: '#333333',    // Bordas mais claras
    outline: '#404040',        // Outline de inputs
    
    // === ESTADOS ===
    success: '#10B981',        // Verde - sucesso
    error: '#EF4444',          // Vermelho - erro
    warning: '#F59E0B',        // Laranja - aviso
    info: '#3B82F6',           // Azul - informação
    
    // === OVERLAY & SOMBRAS ===
    overlay: 'rgba(0, 0, 0, 0.6)',        // Fundo de modais
    shadowColor: '#000000',                // Cor das sombras
    cardShadow: 'rgba(0, 0, 0, 0.3)',     // Sombra de cards
    
    // === GRADIENTES ===
    gradientStart: '#7C3AED',  // Início do gradiente (primary)
    gradientEnd: '#EC4899',    // Fim do gradiente (secondary)
    backgroundGradientStart: '#0D0D0D',
    backgroundGradientEnd: '#141418',
    
    // === COMPONENTES ESPECÍFICOS ===
    inputBackground: '#1A1A1A',
    inputBorder: '#333333',
    inputFocusBorder: '#7C3AED',
    buttonText: '#FFFFFF',
    buttonDisabled: '#404040',
    
    // === TABS & NAVIGATION ===
    tabBarBackground: '#0A0A0A',
    tabBarBorder: '#262626',
    tabBarActive: '#7C3AED',
    tabBarInactive: '#737373',
    
    // === GLASS EFFECT ===
    glassBackground: 'rgba(26, 26, 26, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },

  light: {
    // === CORES PRINCIPAIS ===
    primary: '#7C3AED',        // Roxo vibrante - mantém identidade
    secondary: '#EC4899',      // Rosa - mantém identidade
    
    // === BACKGROUNDS ===
    background: '#FAFAFA',     // Fundo principal (off-white)
    surface: '#FFFFFF',        // Superfície de cards/modais
    surfaceVariant: '#F5F5F5', // Superfície alternativa (cinza muito claro)
    
    // === TEXTOS ===
    text: '#171717',           // Texto principal (quase preto)
    textSecondary: '#525252',  // Texto secundário (cinza escuro)
    textTertiary: '#737373',   // Texto terciário (cinza médio)
    textDisabled: '#A3A3A3',   // Texto desabilitado (cinza claro)
    
    // === BORDAS ===
    border: '#E5E5E5',         // Bordas padrão
    borderLight: '#D4D4D4',    // Bordas mais escuras
    outline: '#A3A3A3',        // Outline de inputs
    
    // === ESTADOS ===
    success: '#059669',        // Verde - sucesso (mais escuro)
    error: '#DC2626',          // Vermelho - erro (mais escuro)
    warning: '#D97706',        // Laranja - aviso (mais escuro)
    info: '#2563EB',           // Azul - informação (mais escuro)
    
    // === OVERLAY & SOMBRAS ===
    overlay: 'rgba(0, 0, 0, 0.4)',        // Fundo de modais
    shadowColor: '#000000',                // Cor das sombras
    cardShadow: 'rgba(0, 0, 0, 0.1)',     // Sombra de cards
    
    // === GRADIENTES ===
    gradientStart: '#7C3AED',  // Início do gradiente (primary)
    gradientEnd: '#EC4899',    // Fim do gradiente (secondary)
    backgroundGradientStart: '#FAFAFA',
    backgroundGradientEnd: '#F5F5F5',
    
    // === COMPONENTES ESPECÍFICOS ===
    inputBackground: '#FFFFFF',
    inputBorder: '#D4D4D4',
    inputFocusBorder: '#7C3AED',
    buttonText: '#FFFFFF',
    buttonDisabled: '#D4D4D4',
    
    // === TABS & NAVIGATION ===
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E5E5',
    tabBarActive: '#7C3AED',
    tabBarInactive: '#737373',
    
    // === GLASS EFFECT ===
    glassBackground: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(0, 0, 0, 0.1)',
  },
};

// Tipo para autocomplete no TypeScript
export type ColorScheme = typeof ColorSchemes.dark;
export type ThemeMode = 'dark' | 'light';

// Cores que não mudam entre temas (opcionais)
export const StaticColors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};
