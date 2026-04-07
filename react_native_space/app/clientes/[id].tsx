import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Client } from '../../types';
import { LoadingScreen } from '../../components/LoadingScreen';
import { spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';

export default function ClienteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const id = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const data = await api.getClient(id);
      setClient(data);
    } catch (error) {
      showToast.error(getErrorMessage(error));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!client) return null;

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes do Cliente</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{client.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>CNPJ</Text>
                <Text style={styles.infoValue}>{client.cnpj}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoValue}>{client.address}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{client.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{client.email}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
    title: { ...typography.heading, fontSize: 24, color: theme.text },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.outline,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    infoContent: {
      marginLeft: spacing.md,
      flex: 1,
    },
    infoLabel: {
      ...typography.caption,
      fontSize: 12,
      marginBottom: 2,
      color: theme.textSecondary,
    },
    infoValue: {
      ...typography.body,
      fontSize: 16,
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.outline,
      marginVertical: spacing.sm,
    },
  });
