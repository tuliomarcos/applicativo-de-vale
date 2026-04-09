import React, { useState, useEffect, useMemo } from 'react';
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
import { Client, Prestador } from '../../types';
import { spacing, typography, borderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';

export default function CriarDiariaScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [client, setClient] = useState<Client | null>(null);
  const [operatorName, setOperatorName] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [morningStart, setMorningStart] = useState('07:00');
  const [morningEnd, setMorningEnd] = useState('12:00');
  const [afternoonStart, setAfternoonStart] = useState('13:00');
  const [afternoonEnd, setAfternoonEnd] = useState('17:00');
  const [equipment, setEquipment] = useState('');
  const [signatureData, setSignatureData] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalHours, setTotalHours] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState<{ field: string; value: Date } | null>(null);
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

  useEffect(() => {
    calculateTotalHours();
  }, [morningStart, morningEnd, afternoonStart, afternoonEnd]);

  const calculateTotalHours = () => {
    try {
      const parseTime = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours + minutes / 60;
      };

      const morningHours = parseTime(morningEnd) - parseTime(morningStart);
      const afternoonHours = parseTime(afternoonEnd) - parseTime(afternoonStart);
      const total = Math.max(0, morningHours) + Math.max(0, afternoonHours);
      setTotalHours(Number(total.toFixed(1)));
    } catch (_error) {
      setTotalHours(0);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!client) newErrors.client = 'Cliente obrigatorio';
    if (!operatorName) newErrors.operatorName = 'Prestador/operador obrigatorio';
    if (!workLocation) newErrors.workLocation = 'Local da obra obrigatorio';
    if (!equipment) newErrors.equipment = 'Equipamento obrigatorio';
    if (totalHours <= 0) newErrors.hours = 'Horario invalido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (value: Date) => value.toLocaleDateString('pt-BR');

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.createValeDiaria({
        clientId: client!.id,
        operatorName,
        workLocation,
        ...(date ? { date: date.toISOString() } : {}),
        morningStart,
        morningEnd,
        afternoonStart,
        afternoonEnd,
        totalHours,
        equipment,
        ...(signatureData ? { signatureData } : {}),
      });

      if (prestador?.phone) {
        try {
          const phone = `55${prestador.phone.replace(/\D/g, '')}`;
          const message = [
            'Novo vale diaria criado para voce.',
            `Cliente: ${client?.name ?? '-'}`,
            `Operador: ${operatorName}`,
            `Local: ${workLocation}`,
            `Data: ${formatDate(date)}`,
            `Manha: ${morningStart} - ${morningEnd}`,
            `Tarde: ${afternoonStart} - ${afternoonEnd}`,
            `Total: ${totalHours}h`,
            `Equipamento: ${equipment}`,
          ].join('\n');

          const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
          await Linking.openURL(whatsappUrl);
        } catch (_whatsError: unknown) {
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

  const handleTimeChange = (field: string, selectedTime?: Date) => {
    setShowTimePicker(null);

    if (!selectedTime) return;

    const hours = selectedTime.getHours().toString().padStart(2, '0');
    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    switch (field) {
      case 'morningStart':
        setMorningStart(timeString);
        break;
      case 'morningEnd':
        setMorningEnd(timeString);
        break;
      case 'afternoonStart':
        setAfternoonStart(timeString);
        break;
      case 'afternoonEnd':
        setAfternoonEnd(timeString);
        break;
      default:
        break;
    }
  };

  const showTimePickerFor = (field: string, currentValue: string) => {
    const [hours, minutes] = currentValue.split(':').map(Number);
    const pickerDate = new Date();
    pickerDate.setHours(hours, minutes, 0, 0);
    setShowTimePicker({ field, value: pickerDate });
  };

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Novo Vale Diaria</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ClientPicker clients={clients} value={client} onChange={(c) => setClient(c)} error={errors.client} />

          <PrestadorPicker
            prestadores={prestadores}
            value={prestador}
            onChange={(selected) => {
              setPrestador(selected);
              setOperatorName(selected?.name ?? '');
            }}
            label="Prestador (operador)"
            error={errors.operatorName}
          />

          <TouchableOpacity onPress={() => router.push('/prestadores/cadastrar')} style={styles.newPrestadorButton}>
            <Ionicons name="person-add-outline" size={18} color={theme.primary} />
            <Text style={styles.newPrestadorText}>Cadastrar prestador</Text>
          </TouchableOpacity>

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
              onChange={(_event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Horarios</Text>

            <View style={styles.timeSection}>
              <Text style={styles.timeSectionLabel}>Manha</Text>
              <View style={styles.timeRow}>
                <TouchableOpacity style={styles.timeButton} onPress={() => showTimePickerFor('morningStart', morningStart)}>
                  <Text style={styles.timeButtonLabel}>Inicio</Text>
                  <Text style={styles.timeButtonValue}>{morningStart}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeButton} onPress={() => showTimePickerFor('morningEnd', morningEnd)}>
                  <Text style={styles.timeButtonLabel}>Fim</Text>
                  <Text style={styles.timeButtonValue}>{morningEnd}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.timeSection}>
              <Text style={styles.timeSectionLabel}>Tarde</Text>
              <View style={styles.timeRow}>
                <TouchableOpacity style={styles.timeButton} onPress={() => showTimePickerFor('afternoonStart', afternoonStart)}>
                  <Text style={styles.timeButtonLabel}>Inicio</Text>
                  <Text style={styles.timeButtonValue}>{afternoonStart}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeButton} onPress={() => showTimePickerFor('afternoonEnd', afternoonEnd)}>
                  <Text style={styles.timeButtonLabel}>Fim</Text>
                  <Text style={styles.timeButtonValue}>{afternoonEnd}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.totalHoursBadge}>
              <Text style={styles.totalHoursText}>Total: {totalHours}h</Text>
            </View>
            {errors.hours && <Text style={styles.errorText}>{errors.hours}</Text>}
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={showTimePicker.value}
              mode="time"
              is24Hour
              display="default"
              onChange={(_event, time) => handleTimeChange(showTimePicker.field, time)}
            />
          )}

          <ThemedTextInput
            label="Equipamento"
            value={equipment}
            onChangeText={setEquipment}
            icon="construct-outline"
            error={errors.equipment}
          />

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
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
      paddingHorizontal: spacing.md,
      paddingVertical: 16,
      borderRadius: borderRadius.md,
    },
    dateText: { ...typography.body, marginLeft: spacing.sm, color: theme.text },
    timeSection: { marginBottom: spacing.md },
    timeSectionLabel: {
      fontSize: 13,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
      fontWeight: '500',
    },
    timeRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    timeButton: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    timeButtonLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    timeButtonValue: {
      ...typography.body,
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    totalHoursBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
    },
    totalHoursText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: '600',
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
      marginTop: spacing.xs,
    },
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
