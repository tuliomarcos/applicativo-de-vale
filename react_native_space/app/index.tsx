import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientButton } from '../components/GradientButton';
import { spacing, typography } from './constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // If authenticated, the AuthContext will handle redirect
  if (user) {
    return null;
  }

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>TerraVale</Text>
            <Text style={styles.tagline}>Gerenciamento de Vales de Terraplanagem</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <GradientButton title="Entrar" onPress={() => router.push('/auth/login')} />
            <View style={styles.buttonSpacing} />
            <GradientButton title="Criar Conta" onPress={() => router.push('/auth/signup')} />
          </View>
        </View>
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
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      justifyContent: 'space-between',
      paddingTop: spacing.xxl,
      paddingBottom: spacing.xl,
    },
    logoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.display,
      marginBottom: spacing.sm,
      color: theme.text,
    },
    tagline: {
      ...typography.caption,
      textAlign: 'center',
      maxWidth: 280,
      color: theme.textSecondary,
    },
    buttonsContainer: {
      width: '100%',
    },
    buttonSpacing: {
      height: spacing.md,
    },
  });
