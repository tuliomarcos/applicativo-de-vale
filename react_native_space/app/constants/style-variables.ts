// Centraliza os tokens de estilo que podem ser usados em todo o app.
// Mantém uma referência simples para alterar cores, tipografia e espaçamentos em um só lugar.
import { ColorSchemes, ThemeMode, ColorScheme } from '../../constants/colors';
import { spacing, typography, borderRadius, presetColors, createTheme } from './theme';

export type { ThemeMode, ColorScheme };

export const palette = ColorSchemes;
export const tokens = {
  spacing,
  typography,
  borderRadius,
  presetColors,
};

// Helper para obter o tema completo (estrutura usada pelo PaperProvider)
export const getPaperTheme = createTheme;

// Stub default export para evitar que o Expo Router trate este arquivo como rota.
const StyleVarsStub = () => null;
export default StyleVarsStub;
