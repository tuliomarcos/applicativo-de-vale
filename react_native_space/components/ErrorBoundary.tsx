import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { theme, spacing, typography } from '../app/constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo deu errado</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Erro desconhecido'}
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => this.setState({ hasError: false, error: undefined })}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: spacing.xl,
  },
  title: {
    ...typography.heading,
    color: theme.colors.text,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  buttonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
