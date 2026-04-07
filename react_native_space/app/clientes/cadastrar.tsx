import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { api } from '../../services/api';
import { spacing, typography } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';
import { formatCnpj, formatPhone, isValidCnpj, isValidPhone, onlyDigits } from '../../utils/inputFormatters';
import { useTheme } from '../../contexts/ThemeContext';

export default function CadastrarClienteScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nome obrigatorio';

    if (!cnpj.trim()) {
      newErrors.cnpj = 'CNPJ obrigatorio';
    } else if (!isValidCnpj(cnpj)) {
      newErrors.cnpj = 'CNPJ invalido';
    }

    if (!address.trim()) newErrors.address = 'Endereco obrigatorio';

    if (!phone.trim()) {
      newErrors.phone = 'Telefone obrigatorio';
    } else if (!isValidPhone(phone)) {
      newErrors.phone = 'Telefone invalido';
    }

    if (!email.trim()) {
      newErrors.email = 'Email obrigatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.createClient({
        name: name.trim(),
        cnpj: onlyDigits(cnpj),
        address: address.trim(),
        phone: onlyDigits(phone),
        email: email.trim(),
      });
      showToast.success(successMessages.createClient);
      router.back();
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Cadastrar Cliente</Text>
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
              label="CNPJ"
              value={cnpj}
              onChangeText={(value) => setCnpj(formatCnpj(value))}
              keyboardType="numeric"
              icon="card-outline"
              error={errors.cnpj}
            />
            <ThemedTextInput
              label="Endereco"
              value={address}
              onChangeText={setAddress}
              icon="location-outline"
              error={errors.address}
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
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              error={errors.email}
            />

            <GradientButton title="Salvar" onPress={handleSubmit} loading={loading} style={styles.submitButton} />
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
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.outline,
      gap: spacing.sm,
    },
    submitButton: {
      marginTop: spacing.lg,
    },
  });
