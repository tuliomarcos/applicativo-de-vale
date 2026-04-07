import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { api } from '../../services/api';
import { spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';

export default function CadastrarPrestadorScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [documentType, setDocumentType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!document) newErrors.document = 'Documento é obrigatório';
    if (!address) newErrors.address = 'Endereço é obrigatório';
    if (!phone) newErrors.phone = 'Telefone é obrigatório';
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await api.createPrestador({
        name,
        document,
        documentType,
        address,
        phone,
        email,
      });
      showToast.success(successMessages.createServiceProvider);
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
            <Text style={styles.title}>Cadastrar Prestador</Text>
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
              label="Documento"
              value={document}
              onChangeText={setDocument}
              keyboardType="numeric"
              icon="card-outline"
              error={errors.document}
            />

            <View style={styles.documentTypeContainer}>
              {(['CPF', 'CNPJ'] as const).map((type) => {
                const active = documentType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.docTypeButton, active && styles.docTypeButtonActive]}
                    onPress={() => setDocumentType(type)}
                  >
                    <Text style={[styles.docTypeText, active && styles.docTypeTextActive]}>{type}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <ThemedTextInput
              label="Endereço"
              value={address}
              onChangeText={setAddress}
              icon="location-outline"
              error={errors.address}
            />
            <ThemedTextInput
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
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
    documentTypeContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
    },
    docTypeButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.outline,
      alignItems: 'center',
      backgroundColor: theme.surfaceVariant,
    },
    docTypeButtonActive: {
      borderColor: theme.primary,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
    },
    docTypeText: { ...typography.body, color: theme.text },
    docTypeTextActive: { color: theme.primary, fontWeight: '600' },
    submitButton: { marginTop: spacing.lg },
  });
