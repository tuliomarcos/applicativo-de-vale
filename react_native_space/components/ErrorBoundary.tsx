import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography } from '../app/constants/theme';
import { useTheme } from '../contexts/ThemeContext';

type ErrorBoundaryState = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ThemedFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function ThemedFallback({ error }: { error?: Error }) {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>{error?.message ?? 'Tente novamente mais tarde.'}</Text>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
      padding: spacing.xl,
    },
    title: {
      ...typography.heading,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    message: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
