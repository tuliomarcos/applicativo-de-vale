import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { theme, spacing, typography, borderRadius } from '../app/constants/theme';

interface SignaturePadProps {
  onSignatureChange?: (signature: string) => void;
  onSave?: (signature: string) => void;
  label?: string;
}

export function SignaturePad({ onSignatureChange, label }: SignaturePadProps) {
  const handleClear = () => {
    onSignatureChange('');
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

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  label: {
    ...typography.body,
    color: theme.colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  canvasContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
