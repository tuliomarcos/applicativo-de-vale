import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { api } from '../../services/api';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

export default function CadastrarPrestadorScreen() {
  const router = useRouter();
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
    } catch (error: any) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>Novo Prestador</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ThemedTextInput
            label="Nome"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            error={errors.name}
          />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tipo de Documento</Text>
            <View style={styles.documentTypeContainer}>
              <TouchableOpacity
                style={[styles.documentTypeButton, documentType === 'CPF' && styles.documentTypeButtonActive]}
                onPress={() => setDocumentType('CPF')}
              >
                <Text style={[styles.documentTypeText, documentType === 'CPF' && styles.documentTypeTextActive]}>
                  CPF
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.documentTypeButton, documentType === 'CNPJ' && styles.documentTypeButtonActive]}
                onPress={() => setDocumentType('CNPJ')}
              >
                <Text style={[styles.documentTypeText, documentType === 'CNPJ' && styles.documentTypeTextActive]}>
                  CNPJ
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ThemedTextInput
            label={documentType}
            value={document}
            onChangeText={setDocument}
            keyboardType="numeric"
            icon="card-outline"
            error={errors.document}
          />

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
  documentTypeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  documentTypeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    alignItems: 'center',
  },
  documentTypeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  documentTypeText: { ...typography.body, fontSize: 16 },
  documentTypeTextActive: { color: theme.colors.primary, fontWeight: '600' },
  submitButton: { marginTop: spacing.lg },
});
