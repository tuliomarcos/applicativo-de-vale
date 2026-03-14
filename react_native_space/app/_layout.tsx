import React from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { theme } from './constants/theme';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.colors.background },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="auth/signup" />
              <Stack.Screen name="(tabs)" />
            </Stack>
            <Toast />
          </AuthProvider>
        </PaperProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
