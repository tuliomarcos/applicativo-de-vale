import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Client } from '../../types';
import { LoadingScreen } from '../../components/LoadingScreen';
import { EmptyState } from '../../components/EmptyState';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

export default function ClientesScreen() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadClientes();
    }, [search])
  );

  const loadClientes = async () => {
    try {
      setLoading(true);
      const params: { search?: string } = {};
      if (search) params.search = search;
      const response = await api.getClients(params);
      setClientes(response.items ?? []);
    } catch (error) {
      console.error('Failed to load clientes:', error);
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleClientPress = (client: Client) => {
    router.push(`/clientes/${client.id}`);
  };

  if (loading && clientes.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Clientes</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, CNPJ..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {clientes.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="Nenhum cliente encontrado"
              description="Cadastre um novo cliente para começar"
            />
          ) : (
            clientes.map((cliente) => (
              <TouchableOpacity
                key={cliente.id}
                style={styles.clientCard}
                onPress={() => handleClientPress(cliente)}
              >
                <View style={styles.clientHeader}>
                  <View style={styles.clientIcon}>
                    <Ionicons name="person" size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{cliente.name}</Text>
                    <Text style={styles.clientDetail}>CNPJ: {cliente.cnpj}</Text>
                    <Text style={styles.clientDetail}>Telefone: {cliente.phone}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.onSurfaceVariant} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={() => router.push('/clientes/cadastrar')}>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { ...typography.display, fontSize: 28 },
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
  clientCard: {
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  clientInfo: { flex: 1 },
  clientName: { ...typography.body, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  clientDetail: { ...typography.caption, fontSize: 13, marginBottom: 2 },
  fab: {
    position: 'absolute',
    bottom: spacing.lg + 60,
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
