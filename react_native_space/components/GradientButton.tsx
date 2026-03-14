import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, PressableProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, spacing, typography } from '../app/constants/theme';

interface GradientButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function GradientButton({ 
  title, 
  loading, 
  variant = 'primary', 
  disabled, 
  ...props 
}: GradientButtonProps) {
  const colors = variant === 'primary' 
    ? theme.colors.gradient.primary 
    : [theme.colors.surfaceElevated, theme.colors.surface];

  return (
    <Pressable {...props} disabled={disabled || loading} style={({ pressed }) => [
      styles.container,
      (disabled || loading) && styles.disabled,
      pressed && styles.pressed,
    ]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
