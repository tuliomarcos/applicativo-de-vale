import React, { useState, useEffect } from 'react';
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
import { Client } from '../../types';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

export default function CriarDiariaScreen() {
  const router = useRouter();
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
    } catch (error) {
      setTotalHours(0);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!client) newErrors.client = 'Cliente é obrigatório';
    if (!operatorName) newErrors.operatorName = 'Nome do operador é obrigatório';
    if (!workLocation) newErrors.workLocation = 'Local da obra é obrigatório';
    if (!equipment) newErrors.equipment = 'Equipamento é obrigatório';
    if (!signatureData) newErrors.signature = 'Assinatura é obrigatória';
    if (totalHours <= 0) newErrors.hours = 'Horário inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.createValeDiaria({
        clientId: client!.id,
        operatorName,
        workLocation,
        date: date.toISOString(),
        morningStart,
        morningEnd,
        afternoonStart,
        afternoonEnd,
        totalHours,
        equipment,
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

  const handleTimeChange = (field: string, selectedTime: Date | undefined) => {
    setShowTimePicker(null);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      switch (field) {
        case 'morningStart': setMorningStart(timeString); break;
        case 'morningEnd': setMorningEnd(timeString); break;
        case 'afternoonStart': setAfternoonStart(timeString); break;
        case 'afternoonEnd': setAfternoonEnd(timeString); break;
      }
    }
  };

  const showTimePickerFor = (field: string, currentValue: string) => {
    const [hours, minutes] = currentValue.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    setShowTimePicker({ field, value: date });
  };

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>Novo Vale Diária</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ClientPicker value={client} onChange={setClient} error={errors.client} />

          <ThemedTextInput
            label="Nome do Operador"
            value={operatorName}
            onChangeText={setOperatorName}
            icon="person-outline"
            error={errors.operatorName}
          />

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
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Horários</Text>
            <View style={styles.timeSection}>
              <Text style={styles.timeSectionLabel}>Manhã</Text>
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => showTimePickerFor('morningStart', morningStart)}
                >
                  <Text style={styles.timeButtonLabel}>Início</Text>
                  <Text style={styles.timeButtonValue}>{morningStart}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => showTimePickerFor('morningEnd', morningEnd)}
                >
                  <Text style={styles.timeButtonLabel}>Fim</Text>
                  <Text style={styles.timeButtonValue}>{morningEnd}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.timeSection}>
              <Text style={styles.timeSectionLabel}>Tarde</Text>
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => showTimePickerFor('afternoonStart', afternoonStart)}
                >
                  <Text style={styles.timeButtonLabel}>Início</Text>
                  <Text style={styles.timeButtonValue}>{afternoonStart}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => showTimePickerFor('afternoonEnd', afternoonEnd)}
                >
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
              onChange={(event, time) => handleTimeChange(showTimePicker.field, time)}
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
  },
  dateText: { ...typography.body, marginLeft: spacing.sm },
  timeSection: { marginBottom: spacing.md },
  timeSectionLabel: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  timeButtonLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  timeButtonValue: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '600',
  },
  totalHoursBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  totalHoursText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: spacing.xs,
  },
  submitButton: { marginTop: spacing.lg },
});
