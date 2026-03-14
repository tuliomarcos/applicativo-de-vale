import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { theme, spacing, typography, borderRadius } from '../constants/theme';

export default function PerfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'EMPRESA_TERRAPLANAGEM':
        return 'Empresa de Terraplanagem';
      case 'PRESTADOR_SERVICO':
        return 'Prestador de Serviço';
      case 'CLIENTE':
        return 'Cliente';
      default:
        return role;
    }
  };

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Perfil</Text>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoValue}>{user?.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{user?.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Tipo de Perfil</Text>
                <Text style={styles.infoValue}>{getRoleName(user?.role ?? '')}</Text>
              </View>
            </View>
          </View>

          {user?.role === 'EMPRESA_TERRAPLANAGEM' && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/empresa/cadastrar')}
            >
              <Ionicons name="business-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.buttonText}>Minha Empresa</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}

          <View style={{ marginVertical: spacing.md }}>
            <ThemeToggle variant="card" />
          </View>

          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
            <Text style={[styles.buttonText, styles.logoutText]}>Sair</Text>
          </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.display,
    fontSize: 28,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.outline,
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
  },
  infoValue: {
    ...typography.body,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outline,
    marginVertical: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: spacing.md,
  },
  buttonText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.md,
    flex: 1,
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
  logoutText: {
    color: theme.colors.error,
  },
});
