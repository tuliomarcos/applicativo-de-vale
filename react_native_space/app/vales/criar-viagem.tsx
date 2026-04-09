import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { SignaturePad } from '../../components/SignaturePad';
import { ClientPicker } from '../../components/ClientPicker';
import { PrestadorPicker } from '../../components/PrestadorPicker';
import { api } from '../../services/api';
import { Client, Prestador, TripType } from '../../types';
import { spacing, typography, borderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';
import { formatTruckPlate, normalizeTruckPlate } from '../../utils/inputFormatters';

export default function CriarViagemScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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
  const [clients, setClients] = useState<Client[]>([]);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [prestador, setPrestador] = useState<Prestador | null>(null);

  const loadClients = React.useCallback(async () => {
    try {
      const response = await api.getClients();
      setClients(response.items ?? []);
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    }
  }, []);

  const loadPrestadores = React.useCallback(async () => {
    try {
      const response = await api.getPrestadores();
      setPrestadores(response.items ?? []);
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    loadClients();
    loadPrestadores();
  }, [loadClients, loadPrestadores]);

  useFocusEffect(
    React.useCallback(() => {
      loadPrestadores();
    }, [loadPrestadores])
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!client) newErrors.client = 'Cliente obrigatorio';
    if (!truckPlate) newErrors.truckPlate = 'Placa do caminhao obrigatoria';
    if (!driverName) newErrors.driverName = 'Nome do motorista obrigatorio';
    if (!workLocation) newErrors.workLocation = 'Local da obra obrigatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.createValeViagem({
        clientId: client!.id,
        truckPlate: normalizeTruckPlate(truckPlate),
        driverName,
        tripType,
        workLocation,
        ...(date ? { date: date.toISOString() } : {}),
        ...(signatureData ? { signatureData } : {}),
      });

      if (prestador?.phone) {
        try {
          const phone = `55${prestador.phone.replace(/\D/g, '')}`;
          const message = [
            'Novo vale viagem criado para voce.',
            `Cliente: ${client?.name ?? '-'}`,
            `Motorista: ${driverName}`,
            `Placa: ${truckPlate}`,
            `Tipo: ${tripType}`,
            `Local: ${workLocation}`,
            `Data: ${formatDate(date)}`,
          ].join('\n');
          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          await Linking.openURL(whatsappUrl);
        } catch (whatsError: unknown) {
          showToast.error('Vale criado, mas nao foi possivel abrir o WhatsApp');
        }
      }

      showToast.success(successMessages.createVoucher);
      router.back();
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value: Date) => value.toLocaleDateString('pt-BR');

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Novo Vale Viagem</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ClientPicker clients={clients} value={client} onChange={(c) => setClient(c)} error={errors.client} />
          <PrestadorPicker
            prestadores={prestadores}
            value={prestador}
            onChange={(selected) => {
              setPrestador(selected);
              if (selected) {
                setDriverName(selected.name);
                setTruckPlate(formatTruckPlate(selected.vehiclePlate));
              }
            }}
            label="Prestador (motorista)"
          />
          <TouchableOpacity onPress={() => router.push('/prestadores/cadastrar')} style={styles.newPrestadorButton}>
            <Ionicons name="person-add-outline" size={18} color={theme.primary} />
            <Text style={styles.newPrestadorText}>Cadastrar prestador</Text>
          </TouchableOpacity>

          <ThemedTextInput
            label="Placa do Caminhao"
            value={truckPlate}
            onChangeText={(text: string) => setTruckPlate(formatTruckPlate(text))}
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
                <Text style={[styles.tripTypeText, tripType === 'ENTULHO' && styles.tripTypeTextActive]}>Entulho</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tripTypeButton, tripType === 'TERRA' && styles.tripTypeButtonActive]}
                onPress={() => setTripType('TERRA')}
              >
                <Text style={[styles.tripTypeText, tripType === 'TERRA' && styles.tripTypeTextActive]}>Terra</Text>
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
            <Text style={styles.sectionLabel}>Data (opcional)</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
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

          <GradientButton title="Salvar Vale" onPress={handleSubmit} loading={loading} style={styles.submitButton} />
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
    backButton: { marginRight: spacing.md },
    title: { ...typography.heading, fontSize: 24, color: theme.text },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    section: { marginBottom: spacing.md },
    sectionLabel: {
      fontSize: 14,
      color: theme.text,
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
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderColor: theme.outline,
      alignItems: 'center',
    },
    tripTypeButtonActive: {
      borderColor: theme.primary,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
    },
    tripTypeText: { ...typography.body, fontSize: 16, color: theme.text },
    tripTypeTextActive: { color: theme.primary, fontWeight: '600' },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      paddingHorizontal: spacing.md,
      paddingVertical: 16,
      borderRadius: borderRadius.md,
    },
    dateText: { ...typography.body, marginLeft: spacing.sm, color: theme.text },
    newPrestadorButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: -spacing.xs,
      marginBottom: spacing.md,
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      backgroundColor: 'rgba(249, 115, 22, 0.12)',
      borderWidth: 1,
      borderColor: theme.outline,
    },
    newPrestadorText: {
      ...typography.caption,
      color: theme.primary,
      fontWeight: '600',
    },
    submitButton: { marginTop: spacing.lg },
  });
