import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Client } from '../../types';
import { LoadingScreen } from '../../components/LoadingScreen';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

export default function ClienteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
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

  if (loading) {
    return <LoadingScreen />;
  }

  if (!client) {
    return null;
  }

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes do Cliente</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{client.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>CNPJ</Text>
                <Text style={styles.infoValue}>{client.cnpj}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoValue}>{client.address}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{client.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.onSurfaceVariant} />
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.outline,
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
  },
  infoValue: {
    ...typography.body,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outline,
    marginVertical: spacing.sm,
  },
});
