import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Vale } from '../../types';
import { LoadingScreen } from '../../components/LoadingScreen';
import { GradientButton } from '../../components/GradientButton';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

export default function ValeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const [vale, setVale] = useState<Vale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVale();
  }, [id]);

  const loadVale = async () => {
    try {
      const data = await api.getVale(id);
      setVale(data);
    } catch (error) {
      showToast.error(getErrorMessage(error));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!vale) {
    return null;
  }

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes do Vale</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.typeHeader}>
              <View style={[styles.typeBadge, vale.type === 'VIAGEM' ? styles.typeBadgeViagem : styles.typeBadgeDiaria]}>
                <Text style={styles.typeBadgeText}>
                  {vale.type === 'VIAGEM' ? 'Vale Viagem' : 'Vale Diária'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cliente</Text>
              <Text style={styles.infoValue}>{vale.client?.name ?? 'Não especificado'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>{formatDate(vale.date)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Local da Obra</Text>
              <Text style={styles.infoValue}>{vale.workLocation}</Text>
            </View>

            {vale.type === 'VIAGEM' && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Placa do Caminhão</Text>
                  <Text style={styles.infoValue}>{vale.truckPlate}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Motorista</Text>
                  <Text style={styles.infoValue}>{vale.driverName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Tipo de Viagem</Text>
                  <Text style={styles.infoValue}>{vale.tripType}</Text>
                </View>
              </>
            )}

            {vale.type === 'DIARIA' && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Operador</Text>
                  <Text style={styles.infoValue}>{vale.operatorName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Equipamento</Text>
                  <Text style={styles.infoValue}>{vale.equipment}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Horário Manhã</Text>
                  <Text style={styles.infoValue}>{vale.morningStart} - {vale.morningEnd}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Horário Tarde</Text>
                  <Text style={styles.infoValue}>{vale.afternoonStart} - {vale.afternoonEnd}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total de Horas</Text>
                  <Text style={[styles.infoValue, styles.totalHours]}>{vale.totalHours}h</Text>
                </View>
              </>
            )}

            {vale.signatureUrl && (
              <View style={styles.signatureSection}>
                <Text style={styles.signatureLabel}>Assinatura</Text>
                <Image source={{ uri: vale.signatureUrl }} style={styles.signatureImage} resizeMode="contain" />
              </View>
            )}
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
  typeHeader: {
    marginBottom: spacing.lg,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  typeBadgeViagem: { backgroundColor: '#3B82F6' },
  typeBadgeDiaria: { backgroundColor: '#10B981' },
  typeBadgeText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  infoRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  infoLabel: {
    ...typography.caption,
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    ...typography.body,
    fontSize: 16,
  },
  totalHours: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  signatureSection: {
    marginTop: spacing.lg,
  },
  signatureLabel: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  signatureImage: {
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(36, 36, 36, 0.5)',
    borderRadius: borderRadius.md,
  },
});
