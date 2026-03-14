import React, { useState, useEffect } from 'react';
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
import { theme, spacing, typography, borderRadius, presetColors } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

export default function CadastrarEmpresaScreen() {
  const router = useRouter();
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
        setPrimaryColor(data.primaryColor);
        setSecondaryColor(data.secondaryColor);
        if (data.logoUrl) {
          setLogoUri(data.logoUrl);
        }
      }
    } catch (error) {
      console.error('Failed to load empresa:', error);
    } finally {
      setInitialLoading(false);
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

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        setLogoUri(result.assets[0].uri);
      }
    } catch (error) {
      showToast.error('Não foi possível selecionar a imagem');
    }
  };

  const uploadLogo = async (empresaId: string): Promise<string | null> => {
    if (!logoUri || logoUri.startsWith('http')) return null;

    try {
      // Get file info
      const filename = logoUri.split('/').pop() ?? 'logo.jpg';
      const contentType = 'image/jpeg';

      // Get presigned URL
      const { uploadUrl, cloud_storage_path } = await api.getPresignedUrl(filename, contentType, true);

      // Read file as blob
      const fileResponse = await fetch(logoUri);
      const blob = await fileResponse.blob();

      // Upload to S3
      await api.uploadFileToS3(uploadUrl, blob, contentType);

      // Complete upload
      const { url } = await api.completeUpload(cloud_storage_path, empresaId);
      return url;
    } catch (error) {
      console.error('Failed to upload logo:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const empresaData = {
        name,
        cnpj,
        address,
        phone,
        primaryColor: customPrimaryColor || primaryColor,
        secondaryColor: customSecondaryColor || secondaryColor,
      };

      let result: Empresa;
      if (empresa) {
        result = await api.updateEmpresa(empresa.id, empresaData);
      } else {
        result = await api.createEmpresa(empresaData);
      }

      // Upload logo if selected
      if (logoUri && !logoUri.startsWith('http')) {
        await uploadLogo(result.id);
      }

      showToast.success(empresa ? successMessages.updateCompany : successMessages.createCompany);
      router.back();
    } catch (error: unknown) {
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.title}>{empresa ? 'Editar' : 'Cadastrar'} Empresa</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ThemedTextInput
            label="Nome da Empresa"
            value={name}
            onChangeText={setName}
            icon="business-outline"
            error={errors.name}
          />

          <ThemedTextInput
            label="CNPJ"
            value={cnpj}
            onChangeText={setCnpj}
            keyboardType="numeric"
            icon="card-outline"
            error={errors.cnpj}
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

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Cores da Empresa</Text>
            
            <View style={styles.colorSection}>
              <Text style={styles.colorLabel}>Cor Primária</Text>
              <View style={styles.colorPalette}>
                {presetColors.map((color: string) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      primaryColor === color && styles.colorCircleSelected,
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
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={customPrimaryColor}
                onChangeText={setCustomPrimaryColor}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.colorSection}>
              <Text style={styles.colorLabel}>Cor Secundária</Text>
              <View style={styles.colorPalette}>
                {presetColors.map((color: string) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      secondaryColor === color && styles.colorCircleSelected,
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
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={customSecondaryColor}
                onChangeText={setCustomSecondaryColor}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Logo da Empresa</Text>
            <TouchableOpacity style={styles.logoUpload} onPress={handlePickImage}>
              {logoUri ? (
                <Image source={{ uri: logoUri }} style={styles.logoImage} resizeMode="contain" />
              ) : (
                <View style={styles.logoPlaceholder}>
                  <Ionicons name="camera-outline" size={48} color={theme.colors.onSurfaceVariant} />
                  <Text style={styles.logoPlaceholderText}>Toque para adicionar logo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <GradientButton
            title={empresa ? 'Atualizar Empresa' : 'Salvar Empresa'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: { ...typography.body },
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
  section: { marginBottom: spacing.lg },
  sectionLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
    fontWeight: '500',
  },
  colorSection: { marginBottom: spacing.lg },
  colorLabel: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: '#FFFFFF',
  },
  customColorInput: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  logoUpload: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.outline,
    borderStyle: 'dashed',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  submitButton: { marginTop: spacing.lg },
});
