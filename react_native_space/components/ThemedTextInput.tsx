import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, typography } from '../app/constants/theme';

interface ThemedTextInputProps extends TextInputProps {
  error?: boolean | string;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
}

export function ThemedTextInput({ error, label, icon, secure, style, ...props }: ThemedTextInputProps) {
  const hasError = Boolean(error);
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={theme.colors.textMuted} 
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input, 
            hasError && styles.inputError,
            icon && styles.inputWithIcon,
            style
          ]}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={secure}
          {...props}
        />
      </View>
      {typeof error === 'string' && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: theme.colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  inputContainer: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.md,
    zIndex: 1,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: theme.colors.text,
  },
  inputWithIcon: {
    paddingLeft: spacing.xl + spacing.md,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    ...typography.caption,
    color: theme.colors.error,
    marginTop: spacing.xs,
  },
});
