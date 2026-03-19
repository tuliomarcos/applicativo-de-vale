import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { useAuth } from '../../contexts/AuthContext';
import { spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';
import { UserRole } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

type ProfileType = UserRole;

interface ProfileOption {
  value: ProfileType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const profileOptions: ProfileOption[] = [
  { value: 'PRESTADOR', label: 'Prestador de Serviço', icon: 'build-outline' },
  { value: 'CLIENTE', label: 'Cliente', icon: 'person-outline' },
  { value: 'EMPRESA', label: 'Empresa de Terraplanagem', icon: 'business-outline' },
];

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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
    if (!email) newErrors.email = 'Email é obrigatório';
    if (!password) newErrors.password = 'Senha é obrigatória';
    if (password && password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não conferem';
    if (!selectedProfile) newErrors.profile = 'Selecione um tipo de perfil';

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
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      showToast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
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
                        color={selectedProfile === option.value ? theme.primary : theme.textSecondary}
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

const createStyles = (theme: any) =>
  StyleSheet.create({
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
      color: theme.text,
    },
    subtitle: {
      ...typography.body,
      marginBottom: spacing.lg,
      color: theme.textSecondary,
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
      color: theme.text,
    },
    profileOptions: {
      flexDirection: 'column',
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: 'transparent',
      marginBottom: spacing.md,
    },
    profileCardSelected: {
      borderColor: theme.primary,
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
    },
    profileCardText: {
      ...typography.body,
      fontSize: 14,
      marginLeft: spacing.md,
      color: theme.text,
      flex: 1,
    },
    profileCardTextSelected: {
      color: theme.primary,
      fontWeight: '600',
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
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
      color: theme.text,
    },
    linkHighlight: {
      color: theme.primary,
      fontWeight: '600',
    },
  });
