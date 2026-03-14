import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { SignaturePad } from '../../components/SignaturePad';
import { ClientPicker } from '../../components/ClientPicker';
import { api } from '../../services/api';
import { Client, TripType } from '../../types';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

export default function CriarViagemScreen() {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [truckPlate, setTruckPlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [tripType, setTripType] = useState<TripType>('ENTULHO');
  const [workLocation, setWorkLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!client) newErrors.client = 'Cliente é obrigatório';
    if (!truckPlate) newErrors.truckPlate = 'Placa do caminhão é obrigatória';
    if (!driverName) newErrors.driverName = 'Nome do motorista é obrigatório';
    if (!workLocation) newErrors.workLocation = 'Local da obra é obrigatório';
    if (!signatureData) newErrors.signature = 'Assinatura é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.createValeViagem({
        clientId: client!.id,
        truckPlate: truckPlate.toUpperCase(),
        driverName,
        tripType,
        workLocation,
        date: date.toISOString(),
        signatureData,
      });
      showToast.success(successMessages.createVoucher);
      router.back();
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>Novo Vale Viagem</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ClientPicker value={client} onChange={setClient} error={errors.client} />

          <ThemedTextInput
            label="Placa do Caminhão"
            value={truckPlate}
            onChangeText={(text: string) => setTruckPlate(text.toUpperCase())}
            autoCapitalize="characters"
            icon="car-outline"
            error={errors.truckPlate}
          />

          <ThemedTextInput
            label="Nome do Motorista"
            value={driverName}
            onChangeText={setDriverName}
            icon="person-outline"
            error={errors.driverName}
          />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tipo de Viagem</Text>
            <View style={styles.tripTypeContainer}>
              <TouchableOpacity
                style={[styles.tripTypeButton, tripType === 'ENTULHO' && styles.tripTypeButtonActive]}
                onPress={() => setTripType('ENTULHO')}
              >
                <Text style={[styles.tripTypeText, tripType === 'ENTULHO' && styles.tripTypeTextActive]}>
                  Entulho
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tripTypeButton, tripType === 'TERRA' && styles.tripTypeButtonActive]}
                onPress={() => setTripType('TERRA')}
              >
                <Text style={[styles.tripTypeText, tripType === 'TERRA' && styles.tripTypeTextActive]}>
                  Terra
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ThemedTextInput
            label="Local da Obra"
            value={workLocation}
            onChangeText={setWorkLocation}
            icon="location-outline"
            error={errors.workLocation}
          />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Data</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <SignaturePad onSave={setSignatureData} />
          {errors.signature && <Text style={styles.errorText}>{errors.signature}</Text>}

          <GradientButton title="Salvar Vale" onPress={handleSubmit} loading={loading} style={styles.submitButton} />
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
  section: { marginBottom: spacing.md },
  sectionLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  tripTypeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    alignItems: 'center',
  },
  tripTypeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  tripTypeText: { ...typography.body, fontSize: 16 },
  tripTypeTextActive: { color: theme.colors.primary, fontWeight: '600' },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
  },
  dateText: { ...typography.body, marginLeft: spacing.sm },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  submitButton: { marginTop: spacing.lg },
});
