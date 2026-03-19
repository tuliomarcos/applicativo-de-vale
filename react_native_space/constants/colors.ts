/**
 * Sistema de Cores - TerraVale App
 *
 * Este arquivo centraliza todas as cores usadas no aplicativo.
 * Para trocar o esquema de cores, basta modificar os valores aqui.
 */

export const ColorSchemes = {
  dark: {
    // === CORES PRINCIPAIS ===
    // Pedido: modo noturno com componentes em laranja
    primary: '#F97316',        // Laranja principal
    secondary: '#FFA94D',      // Laranja claro para variações/accent

    // === BACKGROUNDS ===
    background: '#0D0D0D',     // Fundo escuro
    surface: '#1A1A1A',        // Superfície de cards/modais
    surfaceVariant: '#242424', // Superfície alternativa (mais clara)

    // === TEXTOS ===
    text: '#fff',           // Pedido: texto preto mesmo no modo dark
    textSecondary: '#F1F1F1',  // Texto secundário
    textTertiary: '#E2E2E2',   // Texto terciário
    textDisabled: '#A4A4A4',   // Texto desabilitado

    // === BORDAS ===
    border: '#2D2D2D',         // Bordas padrão
    borderLight: '#383838',    // Bordas mais claras
    outline: '#4A4A4A',        // Outline de inputs

    // === ESTADOS ===
    success: '#10B981',        // Verde - sucesso
    error: '#EF4444',          // Vermelho - erro
    warning: '#F59E0B',        // Laranja - aviso
    info: '#3B82F6',           // Azul - informação

    // === OVERLAY & SOMBRAS ===
    overlay: 'rgba(0, 0, 0, 0.6)',        // Fundo de modais
    shadowColor: '#000000',                // Cor das sombras
    cardShadow: 'rgba(0, 0, 0, 0.35)',     // Sombra de cards

    // === GRADIENTES ===
    gradientStart: '#F97316',  // Início do gradiente (primary)
    gradientEnd: '#FFB067',    // Fim do gradiente (secondary)
    backgroundGradientStart: '#121212',
    backgroundGradientEnd: '#1A1A1A',

    // === COMPONENTES ESPECÍFICOS ===
    inputBackground: '#1A1A1A',
    inputBorder: '#3A3A3A',
    inputFocusBorder: '#F97316',
    buttonText: '#000000',
    buttonDisabled: '#404040',

    // === TABS & NAVIGATION ===
    tabBarBackground: '#0D0D0D',
    tabBarBorder: '#2D2D2D',
    tabBarActive: '#F97316',
    tabBarInactive: '#4A4A4A',

    // === GLASS EFFECT ===
    glassBackground: 'rgba(26, 26, 26, 0.85)',
    glassBorder: 'rgba(0, 0, 0, 0.2)',
  },

  light: {
    // === CORES PRINCIPAIS ===
    primary: '#F97316',        // Laranja mantém identidade
    secondary: '#FFA94D',      // Laranja claro

    // === BACKGROUNDS ===
    background: '#FFFFFF',     // Fundo branco pedido
    surface: '#FFFFFF',        // Superfície de cards/modais
    surfaceVariant: '#F5F5F5', // Superfície alternativa (cinza muito claro)

    // === TEXTOS ===
    text: '#333333',           // Pedido: texto #333 no modo claro
    textSecondary: '#4B5563',  // Cinza escuro
    textTertiary: '#6B7280',   // Cinza médio
    textDisabled: '#9CA3AF',   // Cinza claro

    // === BORDAS ===
    border: '#E5E7EB',         // Bordas padrão
    borderLight: '#D1D5DB',    // Bordas mais escuras
    outline: '#9CA3AF',        // Outline de inputs

    // === ESTADOS ===
    success: '#059669',        // Verde - sucesso (mais escuro)
    error: '#DC2626',          // Vermelho - erro (mais escuro)
    warning: '#D97706',        // Laranja - aviso (mais escuro)
    info: '#2563EB',           // Azul - informação (mais escuro)

    // === OVERLAY & SOMBRAS ===
    overlay: 'rgba(0, 0, 0, 0.4)',        // Fundo de modais
    shadowColor: '#000000',                // Cor das sombras
    cardShadow: 'rgba(0, 0, 0, 0.08)',    // Sombra de cards

    // === GRADIENTES ===
    gradientStart: '#F97316',  // Início do gradiente (primary)
    gradientEnd: '#FFA94D',    // Fim do gradiente (secondary)
    backgroundGradientStart: '#FFFFFF',
    backgroundGradientEnd: '#F8F9FB',

    // === COMPONENTES ESPECÍFICOS ===
    inputBackground: '#FFFFFF',
    inputBorder: '#D1D5DB',
    inputFocusBorder: '#F97316',
    buttonText: '#000000',
    buttonDisabled: '#D1D5DB',

    // === TABS & NAVIGATION ===
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    tabBarActive: '#F97316',
    tabBarInactive: '#6B7280',

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
