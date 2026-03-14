import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, typography } from '../app/constants/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export function EmptyState({ icon = 'document-outline', title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={theme.colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.heading,
    color: theme.colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
