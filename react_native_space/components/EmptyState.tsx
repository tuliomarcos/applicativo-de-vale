import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography } from '../app/constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export function EmptyState({ icon = 'document-outline', title, description }: EmptyStateProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={theme.textSecondary} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    title: {
      ...typography.heading,
      color: theme.text,
      marginTop: spacing.lg,
      textAlign: 'center',
    },
    description: {
      ...typography.body,
      color: theme.textSecondary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });
