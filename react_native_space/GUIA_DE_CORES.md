# 🎨 Guia de Cores - TerraVale App

Este guia explica como o sistema de cores funciona e como personalizar facilmente as cores do aplicativo.

## 📁 Arquivos Importantes

### 1. `constants/colors.ts`
**Este é o arquivo principal para trocar as cores!**

Contém dois esquemas de cores:
- `ColorSchemes.dark` - Modo escuro
- `ColorSchemes.light` - Modo claro

### 2. `contexts/ThemeContext.tsx`
Gerencia o estado do tema (dark/light) e persiste a escolha do usuário.

### 3. `app/constants/theme.ts`
Cria o tema final usando as cores de `constants/colors.ts`.

---

## 🔄 Como Trocar as Cores

### Método 1: Trocar Cores Principais (Recomendado)

Abra `constants/colors.ts` e modifique as cores principais:

```typescript
export const ColorSchemes = {
  dark: {
    // ALTERE ESTAS DUAS CORES PARA MUDAR A IDENTIDADE VISUAL:
    primary: '#7C3AED',    // Cor principal (botões, destaques)
    secondary: '#EC4899',  // Cor secundária (accents)
    
    // O resto das cores podem ser mantidas ou ajustadas conforme necessário
    background: '#0A0A0A',
    surface: '#1A1A1A',
    // ...
  },
  light: {
    // Mesmas cores para modo claro
    primary: '#7C3AED',
    secondary: '#EC4899',
    // ...
  }
};
```

### Método 2: Personalização Completa

Você pode personalizar cada cor individualmente:

```typescript
dark: {
  // === CORES PRINCIPAIS ===
  primary: '#SUA_COR_AQUI',
  secondary: '#SUA_COR_AQUI',
  
  // === BACKGROUNDS ===
  background: '#SUA_COR_AQUI',      // Fundo principal
  surface: '#SUA_COR_AQUI',         // Cards, modais
  surfaceVariant: '#SUA_COR_AQUI',  // Superfície alternativa
  
  // === TEXTOS ===
  text: '#SUA_COR_AQUI',            // Texto principal
  textSecondary: '#SUA_COR_AQUI',   // Texto secundário
  textTertiary: '#SUA_COR_AQUI',    // Texto terciário
  
  // === ESTADOS ===
  success: '#SUA_COR_AQUI',         // Verde - sucesso
  error: '#SUA_COR_AQUI',           // Vermelho - erro
  warning: '#SUA_COR_AQUI',         // Laranja - aviso
  info: '#SUA_COR_AQUI',            // Azul - informação
}
```

---

## 🎨 Paletas de Cores Sugeridas

### Opção 1: Roxo + Rosa (Atual)
```typescript
primary: '#7C3AED',
secondary: '#EC4899',
```

### Opção 2: Laranja + Vermelho
```typescript
primary: '#F97316',
secondary: '#EF4444',
```

### Opção 3: Índigo + Ciano
```typescript
primary: '#4F46E5',
secondary: '#06B6D4',
```

### Opção 4: Verde + Índigo
```typescript
primary: '#10B981',
secondary: '#6366F1',
```

### Opção 5: Rosa + Âmbar
```typescript
primary: '#E11D48',
secondary: '#F59E0B',
```

---

## 💡 Usando as Cores nos Componentes

### Método 1: Com ThemeContext (Recomendado)

```typescript
import { useTheme } from '../contexts/ThemeContext';

function MeuComponente() {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Meu Texto</Text>
    </View>
  );
}
```

### Método 2: Importando diretamente

```typescript
import { theme } from '../app/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.text,
  },
});
```

---

## 🌓 Toggle de Tema

O usuário pode alternar entre modo claro e escuro na tela de Perfil.

Para adicionar o toggle em outros lugares:

```typescript
import { ThemeToggle } from '../components/ThemeToggle';

// Variante card (padrão)
<ThemeToggle variant="card" />

// Variante inline (com switch)
<ThemeToggle variant="inline" />
```

---

## 📱 StatusBar

A StatusBar ajusta automaticamente baseada no tema:

```typescript
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../contexts/ThemeContext';

const { themeMode } = useTheme();
<StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
```

---

## 🔍 Mapeamento de Cores

| Propriedade | Uso | Exemplo |
|------------|-----|--------|
| `primary` | Botões principais, links | Botão "Criar Vale" |
| `secondary` | Accents, highlights | Ícones ativos |
| `background` | Fundo das telas | Tela principal |
| `surface` | Cards, modais | Card de vale |
| `text` | Texto principal | Títulos, labels |
| `textSecondary` | Texto secundário | Subtítulos, hints |
| `success` | Feedback positivo | Toasts de sucesso |
| `error` | Feedback negativo | Toasts de erro |
| `border` | Bordas de elementos | Bordas de inputs |

---

## ⚡ Dicas de Performance

1. **Use `useTheme()` hook** ao invés de importar o tema estático
2. **Evite inline styles** que usam cores - prefira StyleSheet.create
3. **Memoize componentes** que usam tema para evitar re-renders desnecessários

---

## 🐛 Troubleshooting

### As cores não mudaram após editar colors.ts
1. Reinicie o Metro bundler: `yarn expo start --clear`
2. Limpe o cache: `rm -rf .expo node_modules/.cache`

### O tema não persiste após fechar o app
- Verifique se `@react-native-async-storage/async-storage` está instalado
- Verifique permissões de armazenamento no dispositivo

---

## 📚 Referências

- [Material Design Color System](https://m3.material.io/styles/color/overview)
- [Apple Human Interface Guidelines - Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Coolors - Gerador de Paletas](https://coolors.co/)
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
