// Theme constants for the mobile app
import { ColorSchemes, ThemeMode } from '../../constants/colors';

/**
 * Cria o tema baseado no modo (dark/light)
 * Use esta função com o ThemeContext para temas dinâmicos
 */
export const createTheme = (mode: ThemeMode = 'dark') => {
  const colors = ColorSchemes[mode];
  
  return {
    colors: {
      // Cores principais
      primary: colors.primary,
      primaryDark: colors.primary,
      accent: colors.secondary,
      accentDark: colors.secondary,
      
      // Backgrounds
      background: colors.background,
      surface: colors.surface,
      surfaceElevated: colors.surfaceVariant,
      surfaceVariant: colors.surfaceVariant,
      
      // Textos
      text: colors.text,
      textSecondary: colors.textSecondary,
      textMuted: colors.textTertiary,
      onSurface: colors.text,
      onSurfaceVariant: colors.textSecondary,
      
      // Bordas
      border: colors.border,
      borderLight: colors.borderLight,
      outline: colors.outline,
      
      // Estados
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      
      // Outros
      glass: colors.glassBackground,
      glassBorder: colors.glassBorder,
      
      gradient: {
        primary: [colors.gradientStart, colors.gradientEnd],
        background: [colors.backgroundGradientStart, colors.backgroundGradientEnd],
      },
    },
  };
};

// Tema padrão (dark) - usado quando o ThemeContext não está disponível
export const theme = createTheme('dark');

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  display: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    lineHeight: 44,
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const presetColors = [
  { primary: '#7C3AED', secondary: '#EC4899' }, // Violet + Pink (default)
  { primary: '#F97316', secondary: '#EF4444' }, // Orange + Red
  { primary: '#4F46E5', secondary: '#06B6D4' }, // Indigo + Cyan
  { primary: '#10B981', secondary: '#6366F1' }, // Green + Indigo
  { primary: '#E11D48', secondary: '#F59E0B' }, // Rose + Amber
  { primary: '#0EA5E9', secondary: '#8B5CF6' }, // Sky + Purple
  { primary: '#14B8A6', secondary: '#F43F5E' }, // Teal + Rose
  { primary: '#6366F1', secondary: '#10B981' }, // Indigo + Green
];
