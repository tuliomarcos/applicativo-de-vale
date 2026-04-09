import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { api } from '../../services/api';
import { Prestador } from '../../types';
import { spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';
import {
  formatCpf,
  formatPhone,
  formatTruckPlate,
  isValidCpf,
  isValidPhone,
  normalizeTruckPlate,
  onlyDigits,
} from '../../utils/inputFormatters';

export default function EditarPrestadorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadPrestador = async () => {
      try {
        const prestador: Prestador = await api.getPrestador(id);
        setName(prestador.name ?? '');
        setCpf(formatCpf(prestador.cpf ?? ''));
        setPhone(formatPhone(prestador.phone ?? ''));
        setVehiclePlate(formatTruckPlate(prestador.vehiclePlate ?? ''));
      } catch (error: unknown) {
        showToast.error(getErrorMessage(error));
        router.back();
      } finally {
        setInitialLoading(false);
      }
    };

    loadPrestador();
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nome obrigatorio';

    if (cpf.trim() && !isValidCpf(cpf)) {
      newErrors.cpf = 'CPF invalido';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone obrigatorio';
    } else if (!isValidPhone(phone)) {
      newErrors.phone = 'Telefone invalido';
    }

    if (!vehiclePlate.trim()) {
      newErrors.vehiclePlate = 'Placa obrigatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.updatePrestador(id, {
        name: name.trim(),
        ...(cpf.trim() ? { cpf: onlyDigits(cpf) } : { cpf: '' }),
        phone: onlyDigits(phone),
        vehiclePlate: normalizeTruckPlate(vehiclePlate),
      });

      showToast.success('Prestador atualizado com sucesso!');
      router.back();
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.centered}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Editar Prestador</Text>
          </View>

          <View style={styles.form}>
            <ThemedTextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              icon="person-outline"
              error={errors.name}
            />

            <ThemedTextInput
              label="CPF (opcional)"
              value={cpf}
              onChangeText={(value) => setCpf(formatCpf(value))}
              keyboardType="numeric"
              icon="card-outline"
              error={errors.cpf}
            />

            <ThemedTextInput
              label="Telefone"
              value={phone}
              onChangeText={(value) => setPhone(formatPhone(value))}
              keyboardType="phone-pad"
              icon="call-outline"
              error={errors.phone}
            />

            <ThemedTextInput
              label="Placa do Veiculo"
              value={vehiclePlate}
              onChangeText={(value) => setVehiclePlate(formatTruckPlate(value))}
              autoCapitalize="characters"
              icon="car-outline"
              error={errors.vehiclePlate}
            />

            <GradientButton title="Salvar Alteracoes" onPress={handleSubmit} loading={loading} style={styles.submitButton} />
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
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: spacing.xl,
    },
    loadingText: {
      ...typography.body,
      color: theme.textSecondary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
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
    title: {
      ...typography.display,
      fontSize: 24,
      color: theme.text,
    },
    form: {
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      gap: spacing.sm,
    },
    submitButton: { marginTop: spacing.lg },
  });
