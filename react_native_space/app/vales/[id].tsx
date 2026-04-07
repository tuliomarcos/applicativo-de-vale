import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { Vale } from '../../types';
import { LoadingScreen } from '../../components/LoadingScreen';
import { GradientButton } from '../../components/GradientButton';
import { spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';

export default function ValeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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

  if (loading) return <LoadingScreen />;
  if (!vale) return null;

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes do Vale</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.valeId}>#{vale.id.slice(0, 8)}</Text>
              <Text style={styles.valeDate}>{formatDate(vale.date)}</Text>
            </View>
            <Text style={styles.valeType}>{vale.type === 'VIAGEM' ? 'Vale Viagem' : 'Vale Diária'}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Cliente</Text>
            <Text style={styles.infoText}>{vale.client.name}</Text>
            {vale.client.email && <Text style={styles.infoSub}>{vale.client.email}</Text>}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Local</Text>
            <Text style={styles.infoText}>{vale.workLocation}</Text>
          </View>

          {vale.signatureUrl ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Assinatura</Text>
              <Image source={{ uri: vale.signatureUrl }} style={styles.signature} />
            </View>
          ) : null}

          <GradientButton title="Voltar" onPress={() => router.back()} style={styles.backAction} />
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
    title: { ...typography.display, fontSize: 26, color: theme.text },
    scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
    card: {
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      gap: spacing.sm,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    valeId: { ...typography.bodySmall, color: theme.textSecondary },
    valeDate: { ...typography.caption, color: theme.textSecondary },
    valeType: { ...typography.body, fontWeight: '700', color: theme.text },
    sectionTitle: { ...typography.heading, fontSize: 18, color: theme.text },
    infoText: { ...typography.body, fontSize: 16, color: theme.text },
    infoSub: { ...typography.caption, color: theme.textSecondary },
    signature: { height: 180, borderRadius: borderRadius.md, marginTop: spacing.sm },
    backAction: { marginTop: spacing.sm },
  });
