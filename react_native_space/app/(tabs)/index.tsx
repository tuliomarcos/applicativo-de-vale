import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { DashboardStats, UserRole } from '../../types';
import { theme, spacing, typography, borderRadius } from '../constants/theme';

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
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
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
              <ActivityIndicator size="large" color={theme.colors.primary} />
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
                      onPress={() => router.push(card.route)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name={card.icon} size={32} color={theme.colors.primary} />
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

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    marginBottom: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    fontSize: 14,
  },
  actionsSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 18,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  actionCardText: {
    ...typography.body,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.md,
    fontWeight: '600',
  },
});
