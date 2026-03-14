import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { useAuth } from '../../contexts/AuthContext';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

type ProfileType = 'PRESTADOR_SERVICO' | 'CLIENTE' | 'EMPRESA_TERRAPLANAGEM';

interface ProfileOption {
  value: ProfileType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const profileOptions: ProfileOption[] = [
  { value: 'PRESTADOR_SERVICO', label: 'Prestador de Serviço', icon: 'build-outline' },
  { value: 'CLIENTE', label: 'Cliente', icon: 'person-outline' },
  { value: 'EMPRESA_TERRAPLANAGEM', label: 'Empresa de Terraplanagem', icon: 'business-outline' },
];

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!phone) newErrors.phone = 'Telefone é obrigatório';
    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }
    if (!selectedProfile) {
      newErrors.profile = 'Selecione um tipo de perfil';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await signup({
        name,
        phone,
        email,
        password,
        role: selectedProfile!,
      });
      showToast.success(successMessages.signup);
      // Navigation handled by AuthContext
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados</Text>

            <View style={styles.form}>
              <ThemedTextInput
                label="Nome"
                value={name}
                onChangeText={setName}
                icon="person-outline"
                error={errors.name}
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
              <ThemedTextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                secure
                icon="lock-closed-outline"
                error={errors.password}
              />
              <ThemedTextInput
                label="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secure
                icon="lock-closed-outline"
                error={errors.confirmPassword}
              />

              <View style={styles.profileSection}>
                <Text style={styles.profileLabel}>Tipo de Perfil</Text>
                <View style={styles.profileOptions}>
                  {profileOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.profileCard,
                        selectedProfile === option.value && styles.profileCardSelected,
                      ]}
                      onPress={() => setSelectedProfile(option.value)}
                    >
                      <Ionicons
                        name={option.icon}
                        size={32}
                        color={selectedProfile === option.value ? theme.colors.primary : theme.colors.onSurfaceVariant}
                      />
                      <Text
                        style={[
                          styles.profileCardText,
                          selectedProfile === option.value && styles.profileCardTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.profile && <Text style={styles.errorText}>{errors.profile}</Text>}
              </View>

              <GradientButton title="Criar Conta" onPress={handleSignup} loading={loading} />

              <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.linkContainer}>
                <Text style={styles.linkText}>Já tem uma conta? </Text>
                <Text style={[styles.linkText, styles.linkHighlight]}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  form: {
    width: '100%',
  },
  profileSection: {
    marginBottom: spacing.lg,
  },
  profileLabel: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  profileOptions: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  profileCardText: {
    ...typography.body,
    fontSize: 14,
    marginLeft: spacing.md,
    flex: 1,
  },
  profileCardTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: spacing.xs,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  linkText: {
    ...typography.body,
    fontSize: 14,
  },
  linkHighlight: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
