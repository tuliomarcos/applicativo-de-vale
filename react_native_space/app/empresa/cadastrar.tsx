import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { GradientButton } from '../../components/GradientButton';
import { api } from '../../services/api';
import { Empresa } from '../../types';
import { spacing, typography, borderRadius, presetColors } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';
import { useTheme } from '../../contexts/ThemeContext';

export default function CadastrarEmpresaScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#F97316');
  const [secondaryColor, setSecondaryColor] = useState('#F59E0B');
  const [customPrimaryColor, setCustomPrimaryColor] = useState('');
  const [customSecondaryColor, setCustomSecondaryColor] = useState('');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadEmpresa();
  }, []);

  const loadEmpresa = async () => {
    try {
      const data = await api.getEmpresa();
      if (data) {
        setEmpresa(data);
        setName(data.name);
        setCnpj(data.cnpj);
        setAddress(data.address);
        setPhone(data.phone);
        setPrimaryColor(data.primaryColor || primaryColor);
        setSecondaryColor(data.secondaryColor || secondaryColor);
        if (data.logoUrl) setLogoUri(data.logoUrl);
      }
    } catch (error) {
      // Ignore if not found
    } finally {
      setInitialLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!cnpj) newErrors.cnpj = 'CNPJ é obrigatório';
    if (!address) newErrors.address = 'Endereço é obrigatório';
    if (!phone) newErrors.phone = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = {
        name,
        cnpj,
        address,
        phone,
        primaryColor: customPrimaryColor || primaryColor,
        secondaryColor: customSecondaryColor || secondaryColor,
        logoUri,
      };
      const isUpdate = Boolean(empresa?.id);
      if (isUpdate && empresa?.id) {
        await api.updateEmpresa(empresa.id, payload);
      } else {
        await api.createEmpresa(payload);
      }
      showToast.success(isUpdate ? successMessages.updateCompany : successMessages.createCompany);
      router.back();
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <GradientButton title="Carregando..." disabled />;

  return (
    <LinearGradient colors={[theme.backgroundGradientStart, theme.backgroundGradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Minha Empresa</Text>
          </View>

          <View style={styles.form}>
            <ThemedTextInput label="Nome" value={name} onChangeText={setName} error={errors.name} />
            <ThemedTextInput label="CNPJ" value={cnpj} onChangeText={setCnpj} error={errors.cnpj} />
            <ThemedTextInput label="Endereço" value={address} onChangeText={setAddress} error={errors.address} />
            <ThemedTextInput label="Telefone" value={phone} onChangeText={setPhone} error={errors.phone} />

            <Text style={styles.sectionLabel}>Cores da Empresa</Text>

            <View style={styles.colorSection}>
              <Text style={styles.colorLabel}>Cor Primária</Text>
              <View style={styles.colorPalette}>
                {presetColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      (customPrimaryColor || primaryColor) === color && styles.colorCircleSelected,
                    ]}
                    onPress={() => {
                      setPrimaryColor(color);
                      setCustomPrimaryColor('');
                    }}
                  />
                ))}
              </View>
              <TextInput
                style={styles.customColorInput}
                placeholder="Ou digite uma cor hex (ex: #FF5733)"
                placeholderTextColor={theme.textSecondary}
                value={customPrimaryColor}
                onChangeText={setCustomPrimaryColor}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.colorSection}>
              <Text style={styles.colorLabel}>Cor Secundária</Text>
              <View style={styles.colorPalette}>
                {presetColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      (customSecondaryColor || secondaryColor) === color && styles.colorCircleSelected,
                    ]}
                    onPress={() => {
                      setSecondaryColor(color);
                      setCustomSecondaryColor('');
                    }}
                  />
                ))}
              </View>
              <TextInput
                style={styles.customColorInput}
                placeholder="Ou digite uma cor hex (ex: #33C3FF)"
                placeholderTextColor={theme.textSecondary}
                value={customSecondaryColor}
                onChangeText={setCustomSecondaryColor}
                autoCapitalize="characters"
              />
            </View>

            <Text style={styles.sectionLabel}>Logo</Text>
            <TouchableOpacity style={styles.logoPicker} onPress={pickImage}>
              {logoUri ? (
                <Image source={{ uri: logoUri }} style={styles.logo} />
              ) : (
                <Ionicons name="camera-outline" size={48} color={theme.textSecondary} />
              )}
            </TouchableOpacity>

            <GradientButton title="Salvar" onPress={handleSave} loading={loading} style={styles.saveButton} />
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
      gap: spacing.md,
    },
    sectionLabel: {
      ...typography.heading,
      fontSize: 16,
      color: theme.text,
      marginTop: spacing.md,
    },
    colorSection: {
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    colorLabel: {
      ...typography.body,
      color: theme.text,
    },
    colorPalette: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    colorCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    colorCircleSelected: {
      borderColor: theme.primary,
    },
    customColorInput: {
      backgroundColor: theme.surfaceVariant,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.outline,
    },
    logoPicker: {
      marginTop: spacing.sm,
      height: 140,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      backgroundColor: theme.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: '100%',
      height: '100%',
      borderRadius: borderRadius.lg,
    },
    saveButton: { marginTop: spacing.lg },
  });
