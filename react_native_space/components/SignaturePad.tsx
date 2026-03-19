import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { spacing, typography, borderRadius } from '../app/constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface SignaturePadProps {
  onSignatureChange?: (signature: string) => void;
  onSave?: (signature: string) => void;
  label?: string;
}

export function SignaturePad({ onSignatureChange, label }: SignaturePadProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.canvasContainer, styles.webPlaceholder]}>
          <Text style={styles.webPlaceholderText}>
            Assinatura não disponível no web. Use no app mobile.
          </Text>
        </View>
        <Pressable style={styles.clearButton} onPress={() => onSignatureChange?.('')}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </Pressable>
      </View>
    );
  }

  const handleClear = () => {
    onSignatureChange?.('');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.canvasContainer}>
        <Canvas style={styles.canvas}>
          {/* Placeholder for signature */}
        </Canvas>
      </View>
      <Pressable style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>Limpar</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing.md,
    },
    label: {
      ...typography.body,
      color: theme.text,
      marginBottom: spacing.xs,
      fontWeight: '600',
    },
    canvasContainer: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surface,
      overflow: 'hidden',
    },
    canvas: {
      height: 200,
    },
    clearButton: {
      marginTop: spacing.sm,
      paddingVertical: spacing.sm,
      alignItems: 'center',
    },
    clearButtonText: {
      ...typography.body,
      color: theme.primary,
      fontWeight: '600',
    },
    webPlaceholder: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    webPlaceholderText: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
