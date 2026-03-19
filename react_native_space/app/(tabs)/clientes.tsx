import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Client } from '../../types';
import { LoadingScreen } from '../../components/LoadingScreen';
import { EmptyState } from '../../components/EmptyState';
import { spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';

export default function ClientesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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

  const filteredClientes = clientes.filter((c) => {
    if (!search) return true;
    return (
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.cnpj.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Clientes</Text>
        </View>

        <View style={styles.searchCard}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={20} color={theme.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome ou CNPJ"
              placeholderTextColor={theme.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {loading ? (
          <LoadingScreen />
        ) : filteredClientes.length === 0 ? (
          <>
            <EmptyState
              title="Nenhum cliente encontrado"
              description="Cadastre um cliente para começar a gerar vales."
            />
            <TouchableOpacity
              style={styles.emptyAction}
              onPress={() => router.push('/clientes/cadastrar')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyActionText}>Cadastrar cliente</Text>
            </TouchableOpacity>
          </>
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            {filteredClientes.map((client) => (
              <TouchableOpacity
                key={client.id}
                style={styles.clientCard}
                onPress={() => router.push(`/clientes/${client.id}` as any)}
              >
                <View style={styles.clientHeader}>
                  <View style={styles.clientIcon}>
                    <Ionicons name="business" size={20} color={theme.primary} />
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientDetail}>{client.cnpj}</Text>
                    <Text style={styles.clientDetail}>{client.email}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/clientes/cadastrar')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={26} color="#000000" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    gradient: { flex: 1 },
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      justifyContent: 'space-between',
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.outline,
      marginRight: spacing.md,
    },
    title: {
      ...typography.display,
      fontSize: 26,
      color: theme.text,
      flex: 1,
    },
    searchCard: {
      marginHorizontal: spacing.lg,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...typography.body,
      color: theme.text,
      marginLeft: spacing.sm,
    },
    listContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.md,
    },
    clientCard: {
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
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
    clientName: { ...typography.body, fontSize: 16, fontWeight: '600', marginBottom: 4, color: theme.text },
    clientDetail: { ...typography.caption, fontSize: 13, marginBottom: 2, color: theme.textSecondary },
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
    emptyAction: {
      marginTop: spacing.lg,
      marginHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      backgroundColor: theme.primary,
    },
    emptyActionText: {
      ...typography.body,
      fontWeight: '600',
      color: '#000000',
    },
  });
