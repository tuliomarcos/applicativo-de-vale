import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography, borderRadius } from '../app/constants/theme';

interface ThemeToggleProps {
  variant?: 'card' | 'inline';
}

export function ThemeToggle({ variant = 'card' }: ThemeToggleProps) {
  const { theme, themeMode, toggleTheme } = useTheme();
  const isDark = themeMode === 'dark';

  if (variant === 'inline') {
    return (
      <View style={styles.inlineContainer}>
        <View style={styles.iconTextContainer}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={20}
            color={theme.textSecondary}
            style={styles.icon}
          />
          <Text style={[styles.inlineText, { color: theme.text }]}>
            {isDark ? 'Modo Escuro' : 'Modo Claro'}
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.outline, true: theme.primary }}
          thumbColor={'#FFFFFF'}
          ios_backgroundColor={theme.outline}
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme.surfaceVariant }]}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={24}
            color={theme.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            {isDark ? 'Modo Escuro' : 'Modo Claro'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Tocar para alternar
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilo Card
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    ...typography.bodySmall,
  },
  
  // Estilo Inline
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  inlineText: {
    ...typography.body,
  },
});
