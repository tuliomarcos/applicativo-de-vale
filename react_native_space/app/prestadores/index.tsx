import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Prestador } from '../../types';
import { LoadingScreen } from '../../components/LoadingScreen';
import { EmptyState } from '../../components/EmptyState';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

export default function PrestadoresScreen() {
  const router = useRouter();
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadPrestadores();
    }, [search])
  );

  const loadPrestadores = async () => {
    try {
      setLoading(true);
      const params: { search?: string } = {};
      if (search) params.search = search;
      const response = await api.getPrestadores(params);
      setPrestadores(response.items ?? []);
    } catch (error) {
      console.error('Failed to load prestadores:', error);
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading && prestadores.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>Prestadores</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, documento..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {prestadores.length === 0 ? (
            <EmptyState
              icon="briefcase-outline"
              title="Nenhum prestador encontrado"
              description="Cadastre um novo prestador para começar"
            />
          ) : (
            prestadores.map((prestador) => (
              <TouchableOpacity key={prestador.id} style={styles.prestadorCard}>
                <View style={styles.prestadorHeader}>
                  <View style={styles.prestadorIcon}>
                    <Ionicons name="person" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.prestadorInfo}>
                    <Text style={styles.prestadorName}>{prestador.name}</Text>
                    <Text style={styles.prestadorDetail}>
                      {prestador.documentType}: {prestador.document}
                    </Text>
                    <Text style={styles.prestadorDetail}>Telefone: {prestador.phone}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={() => router.push('/prestadores/cadastrar')}>
          <LinearGradient colors={['#F97316', '#F59E0B']} style={styles.fabGradient}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: { marginRight: spacing.md },
  title: { ...typography.heading, fontSize: 24 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  listContainer: { flex: 1 },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  prestadorCard: {
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  prestadorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prestadorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  prestadorInfo: { flex: 1 },
  prestadorName: { ...typography.body, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  prestadorDetail: { ...typography.caption, fontSize: 13, marginBottom: 2 },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
