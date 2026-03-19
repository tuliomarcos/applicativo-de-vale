import React, { useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography } from '../app/constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface ThemedTextInputProps extends TextInputProps {
  error?: boolean | string;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
}

export function ThemedTextInput({ error, label, icon, secure, style, ...props }: ThemedTextInputProps) {
  const hasError = Boolean(error);
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={theme.textSecondary} 
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
          placeholderTextColor={theme.textSecondary}
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

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.body,
      color: theme.text,
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
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...typography.body,
      color: theme.text,
    },
    inputWithIcon: {
      paddingLeft: spacing.xl + spacing.md,
    },
    inputError: {
      borderColor: theme.error,
    },
    errorText: {
      ...typography.caption,
      color: theme.error,
      marginTop: spacing.xs,
    },
  });
