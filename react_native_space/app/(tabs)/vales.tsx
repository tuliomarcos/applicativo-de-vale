import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { api } from '../../services/api';
import { Vale } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../../components/LoadingScreen';
import { EmptyState } from '../../components/EmptyState';
import { theme, spacing, typography, borderRadius } from '../constants/theme';
import { showToast, getErrorMessage, successMessages } from '../../utils/toast';

type FilterType = 'ALL' | 'VIAGEM' | 'DIARIA';

export default function ValesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [vales, setVales] = useState<Vale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [search, setSearch] = useState('');
  const [selectedVale, setSelectedVale] = useState<Vale | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadVales();
    }, [filter, search])
  );

  const loadVales = async () => {
    try {
      setLoading(true);
      const params: { type?: Exclude<FilterType, 'ALL'>; search?: string } = {};
      if (filter !== 'ALL') params.type = filter;
      if (search) params.search = search;
      const response = await api.getVales(params);
      setVales(response.items ?? []);
    } catch (error) {
      console.error('Failed to load vales:', error);
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleValePress = (vale: Vale) => {
    setSelectedVale(vale);
    setShowActions(true);
  };

  const handleView = () => {
    setShowActions(false);
    if (selectedVale) {
      router.push(`/vales/${selectedVale.id}`);
    }
  };

  const handleEdit = () => {
    setShowActions(false);
    if (selectedVale) {
      // For simplicity, navigate to view screen (edit mode can be added)
      router.push(`/vales/${selectedVale.id}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedVale) return;
    setShowActions(false);

    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este vale?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteVale(selectedVale.id);
              showToast.success('Operação realizada com sucesso!');
              loadVales();
            } catch (error) {
              showToast.error(getErrorMessage(error));
            }
          },
        },
      ]
    );
  };

  const handleGeneratePDF = async () => {
    if (!selectedVale) return;
    setShowActions(false);

    try {
      const { pdfUrl } = await api.generatePDF([selectedVale.id]);
      
      if (Platform.OS === 'web') {
        window.open(pdfUrl, '_blank');
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(pdfUrl);
        } else {
          showToast.success('Operação realizada com sucesso!');
        }
      }
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleSendEmail = async () => {
    if (!selectedVale || !recipientEmail) return;
    setShowEmailModal(false);

    try {
      await api.sendEmail([selectedVale.id], recipientEmail);
      showToast.success('Operação realizada com sucesso!');
      setRecipientEmail('');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleWhatsApp = async () => {
    if (!selectedVale) return;
    setShowActions(false);

    try {
      const { whatsappUrl } = await api.getShareLink([selectedVale.id]);
      if (Platform.OS === 'web') {
        window.open(whatsappUrl, '_blank');
      } else {
        const { Linking } = await import('react-native');
        await Linking.openURL(whatsappUrl);
      }
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const canEdit = user?.role === 'EMPRESA';

  if (loading && vales.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <LinearGradient colors={['#0D0D0D', '#141418']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Vales</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente, placa, local..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
            onPress={() => setFilter('ALL')}
          >
            <Text style={[styles.filterChipText, filter === 'ALL' && styles.filterChipTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'VIAGEM' && styles.filterChipActive]}
            onPress={() => setFilter('VIAGEM')}
          >
            <Text style={[styles.filterChipText, filter === 'VIAGEM' && styles.filterChipTextActive]}>
              Viagem
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'DIARIA' && styles.filterChipActive]}
            onPress={() => setFilter('DIARIA')}
          >
            <Text style={[styles.filterChipText, filter === 'DIARIA' && styles.filterChipTextActive]}>
              Diária
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {vales.length === 0 ? (
            <EmptyState
              icon="document-text-outline"
              title="Nenhum vale encontrado"
              description="Crie um novo vale para começar"
            />
          ) : (
            vales.map((vale) => (
              <TouchableOpacity
                key={vale.id}
                style={styles.valeCard}
                onPress={() => handleValePress(vale)}
              >
                <View style={styles.valeHeader}>
                  <View style={[styles.typeBadge, vale.type === 'VIAGEM' ? styles.typeBadgeViagem : styles.typeBadgeDiaria]}>
                    <Text style={styles.typeBadgeText}>{vale.type === 'VIAGEM' ? 'Viagem' : 'Diária'}</Text>
                  </View>
                  <Text style={styles.valeDate}>{formatDate(vale.date)}</Text>
                </View>
                <Text style={styles.valeClient}>{vale.client?.name ?? 'Cliente não especificado'}</Text>
                <Text style={styles.valeLocation}>{vale.workLocation}</Text>
                {vale.type === 'VIAGEM' && (
                  <Text style={styles.valeDetail}>Placa: {vale.truckPlate} • Motorista: {vale.driverName}</Text>
                )}
                {vale.type === 'DIARIA' && (
                  <Text style={styles.valeDetail}>Operador: {vale.operatorName} • {vale.totalHours}h</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.fab} onPress={() => setShowCreateModal(true)}>
          <LinearGradient colors={['#F97316', '#F59E0B']} style={styles.fabGradient}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Actions Modal */}
        <Modal
          isVisible={showActions}
          onBackdropPress={() => setShowActions(false)}
          style={styles.modal}
          backdropOpacity={0.7}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ações</Text>
            <TouchableOpacity style={styles.modalOption} onPress={handleView}>
              <Ionicons name="eye-outline" size={24} color={theme.colors.onSurface} />
              <Text style={styles.modalOptionText}>Visualizar</Text>
            </TouchableOpacity>
            {canEdit && (
              <>
                <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
                  <Ionicons name="create-outline" size={24} color={theme.colors.onSurface} />
                  <Text style={styles.modalOptionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
                  <Text style={[styles.modalOptionText, { color: theme.colors.error }]}>Apagar</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.modalOption} onPress={handleGeneratePDF}>
              <Ionicons name="document-outline" size={24} color={theme.colors.onSurface} />
              <Text style={styles.modalOptionText}>Gerar PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => { setShowActions(false); setShowEmailModal(true); }}>
              <Ionicons name="mail-outline" size={24} color={theme.colors.onSurface} />
              <Text style={styles.modalOptionText}>Enviar por Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={24} color={theme.colors.success} />
              <Text style={styles.modalOptionText}>Enviar por WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Create Modal */}
        <Modal
          isVisible={showCreateModal}
          onBackdropPress={() => setShowCreateModal(false)}
          style={styles.modal}
          backdropOpacity={0.7}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Novo Vale</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowCreateModal(false);
                router.push('/vales/criar-viagem');
              }}
            >
              <Ionicons name="car-outline" size={24} color={theme.colors.onSurface} />
              <Text style={styles.modalOptionText}>Vale Viagem</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowCreateModal(false);
                router.push('/vales/criar-diaria');
              }}
            >
              <Ionicons name="time-outline" size={24} color={theme.colors.onSurface} />
              <Text style={styles.modalOptionText}>Vale Diária</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Email Modal */}
        <Modal
          isVisible={showEmailModal}
          onBackdropPress={() => setShowEmailModal(false)}
          style={styles.modal}
          backdropOpacity={0.7}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enviar por Email</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="Digite o email do destinatário"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={recipientEmail}
              onChangeText={setRecipientEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendEmail}
              disabled={!recipientEmail}
            >
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { ...typography.display, fontSize: 28 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: { ...typography.body, fontSize: 14 },
  filterChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  listContainer: { flex: 1 },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  valeCard: {
    backgroundColor: theme.colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  valeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  typeBadgeViagem: { backgroundColor: '#3B82F6' },
  typeBadgeDiaria: { backgroundColor: '#10B981' },
  typeBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  valeDate: { ...typography.caption, fontSize: 12 },
  valeClient: { ...typography.body, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  valeLocation: { ...typography.body, fontSize: 14, marginBottom: 4 },
  valeDetail: { ...typography.caption, fontSize: 12 },
  fab: {
    position: 'absolute',
    bottom: spacing.lg + 60,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalTitle: { ...typography.heading, fontSize: 20, marginBottom: spacing.lg },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  modalOptionText: { ...typography.body, fontSize: 16, marginLeft: spacing.md },
  emailInput: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    color: theme.colors.onSurface,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  sendButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
