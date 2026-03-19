import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { DashboardStats, UserRole } from '../../types';
import { spacing, typography, borderRadius } from '../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface ActionCard {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  roles: UserRole[];
}

const actionCards: ActionCard[] = [
  { title: 'Criar Vale Viagem', icon: 'car-outline', route: '/vales/criar-viagem', roles: ['EMPRESA', 'PRESTADOR'] },
  { title: 'Criar Vale Diária', icon: 'time-outline', route: '/vales/criar-diaria', roles: ['EMPRESA', 'PRESTADOR'] },
  { title: 'Lista de Vales', icon: 'document-text-outline', route: '/(tabs)/vales', roles: ['EMPRESA', 'PRESTADOR', 'CLIENTE'] },
  { title: 'Clientes', icon: 'people-outline', route: '/(tabs)/clientes', roles: ['EMPRESA', 'PRESTADOR'] },
  { title: 'Prestadores', icon: 'briefcase-outline', route: '/prestadores', roles: ['EMPRESA'] },
  { title: 'Minha Empresa', icon: 'business-outline', route: '/empresa/cadastrar', roles: ['EMPRESA'] },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = user?.role
    ? actionCards.filter((card) => card.roles.includes(user.role))
    : [];

  const getRoleName = (role: UserRole | '') => {
    switch (role) {
      case 'EMPRESA':
        return 'Empresa';
      case 'PRESTADOR':
        return 'Prestador';
      case 'CLIENTE':
        return 'Cliente';
      default:
        return role;
    }
  };

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Olá, {user?.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getRoleName(user?.role ?? '')}</Text>
              </View>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats?.totalVales ?? 0}</Text>
                  <Text style={styles.statLabel}>Total de Vales</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats?.totalClients ?? 0}</Text>
                  <Text style={styles.statLabel}>Clientes</Text>
                </View>
              </View>

              <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Ações Rápidas</Text>
                <View style={styles.actionsGrid}>
                  {filteredCards.map((card) => (
                    <TouchableOpacity
                      key={card.title}
                      style={styles.actionCard}
                      onPress={() => router.push(card.route as any)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name={card.icon} size={32} color={theme.primary} />
                      <Text style={styles.actionCardText}>{card.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    header: {
      marginBottom: spacing.lg,
    },
    greeting: {
      ...typography.display,
      fontSize: 28,
      color: theme.text,
    },
    badge: {
      marginTop: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: theme.surfaceVariant,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.outline,
    },
    badgeText: {
      ...typography.bodySmall,
      color: theme.textSecondary,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      marginRight: spacing.md,
    },
    statValue: {
      ...typography.h1,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    statLabel: {
      ...typography.caption,
      color: theme.textSecondary,
    },
    actionsSection: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.heading,
      color: theme.text,
      marginBottom: spacing.md,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    actionCard: {
      width: '48%',
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.outline,
      marginBottom: spacing.md,
    },
    actionCardText: {
      ...typography.body,
      color: theme.text,
      fontWeight: '600',
      marginTop: spacing.sm,
    },
  });
