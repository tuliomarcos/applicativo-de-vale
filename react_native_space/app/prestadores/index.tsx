import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Prestador } from '../../types';
import { LoadingScreen } from '../../components/LoadingScreen';
import { EmptyState } from '../../components/EmptyState';
import { spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';
import { onlyDigits } from '../../utils/inputFormatters';

export default function PrestadoresScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadPrestadores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getPrestadores();
      setPrestadores(response.items ?? []);
    } catch (error) {
      console.error('Failed to load prestadores:', error);
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPrestadores();
    }, [loadPrestadores])
  );

  const filtered = prestadores.filter((p) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;

    const digitSearch = onlyDigits(term);

    return (
      p.name.toLowerCase().includes(term) ||
      p.cpf.toLowerCase().includes(term) ||
      p.vehiclePlate.toLowerCase().includes(term) ||
      (digitSearch.length > 0 && onlyDigits(p.phone).includes(digitSearch))
    );
  });

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Prestadores</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, CPF, placa ou telefone"
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <LoadingScreen />
        ) : filtered.length === 0 ? (
          <>
            <EmptyState
              title="Nenhum prestador encontrado"
              description="Cadastre um prestador para comecar."
            />
            <TouchableOpacity style={styles.emptyAction} onPress={() => router.push('/prestadores/cadastrar')}>
              <Text style={styles.emptyActionText}>Cadastrar prestador</Text>
            </TouchableOpacity>
          </>
        ) : (
          <ScrollView contentContainerStyle={styles.listContent}>
            {filtered.map((prestador) => (
              <TouchableOpacity key={prestador.id} style={styles.card} onPress={() => router.push(`/prestadores/${prestador.id}` as any)}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="person" size={24} color={theme.primary} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{prestador.name}</Text>
                    <Text style={styles.cardSub}>CPF: {prestador.cpf}</Text>
                    <Text style={styles.cardSub}>Telefone: {prestador.phone}</Text>
                    <Text style={styles.cardSub}>Placa: {prestador.vehiclePlate}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.fab} onPress={() => router.push('/prestadores/cadastrar')}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
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
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surface,
      marginRight: spacing.md,
      borderWidth: 1,
      borderColor: theme.outline,
    },
    title: { ...typography.display, fontSize: 26, color: theme.text, flex: 1 },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      marginHorizontal: spacing.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
    },
    searchInput: {
      flex: 1,
      marginLeft: spacing.sm,
      color: theme.text,
    },
    listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
    card: {
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    cardInfo: { flex: 1 },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: { ...typography.body, fontSize: 16, fontWeight: '600', color: theme.text },
    cardSub: { ...typography.caption, color: theme.textSecondary },
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
