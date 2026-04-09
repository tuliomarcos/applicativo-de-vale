import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { spacing, typography, borderRadius } from '../constants/theme';
import { UserRole } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { showToast, getErrorMessage } from '../../utils/toast';

export default function PerfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const doLogout = async () => {
    try {
      await logout();
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = typeof globalThis.confirm === 'function'
        ? globalThis.confirm('Tem certeza que deseja sair?')
        : true;
      if (confirmed) {
        doLogout();
      }
      return;
    }

    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: doLogout,
        },
      ]
    );
  };

  const getRoleName = (role: UserRole | '') => {
    switch (role) {
      case 'EMPRESA':
        return 'Empresa de Terraplanagem';
      case 'PRESTADOR':
        return 'Prestador de Serviço';
      case 'CLIENTE':
        return 'Cliente';
      default:
        return role;
    }
  };

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Perfil</Text>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{user?.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{user?.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={20} color={theme.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tipo de Perfil</Text>
                <Text style={styles.infoValue}>{getRoleName(user?.role ?? '')}</Text>
              </View>
            </View>
          </View>

          {user?.role === 'EMPRESA' && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/empresa/cadastrar')}
            >
              <Ionicons name="business-outline" size={20} color={theme.primary} />
              <Text style={styles.buttonText}>Minha Empresa</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}

          <View style={{ marginVertical: spacing.md }}>
            <ThemeToggle variant="card" />
          </View>

          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={theme.error} />
            <Text style={[styles.buttonText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>
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
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    title: {
      ...typography.display,
      fontSize: 28,
      marginBottom: spacing.lg,
      color: theme.text,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      marginBottom: spacing.lg,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    infoContent: {
      marginLeft: spacing.md,
      flex: 1,
    },
    infoLabel: {
      ...typography.caption,
      fontSize: 12,
      marginBottom: 2,
      color: theme.textSecondary,
    },
    infoValue: {
      ...typography.body,
      fontSize: 16,
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.outline,
      marginVertical: spacing.sm,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.outline,
      marginBottom: spacing.md,
    },
    buttonText: {
      ...typography.body,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: spacing.md,
      flex: 1,
      color: theme.text,
    },
    logoutButton: {
      marginTop: spacing.lg,
    },
    logoutText: {
      color: theme.error,
    },
  });
