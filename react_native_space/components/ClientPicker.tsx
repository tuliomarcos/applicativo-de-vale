import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, spacing, typography, borderRadius } from '../app/constants/theme';

interface Client {
  id: string;
  nome: string;
}

interface ClientPickerProps {
  clients?: Client[];
  selectedClientId?: string;
  onSelectClient?: (clientId: string) => void;
  value?: Client | null;
  onChange?: (client: Client | null) => void;
  label?: string;
  error?: string;
}

export function ClientPicker({ clients, selectedClientId, onSelectClient, label, error }: ClientPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedClient = clients?.find((c) => c?.id === selectedClientId);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={[styles.picker, error && styles.pickerError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerText, !selectedClient && styles.placeholderText]}>
          {selectedClient?.nome || 'Selecione um cliente'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.colors.textMuted} />
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Cliente</Text>
            <FlatList
              data={clients}
              keyExtractor={(item) => item?.id || ''}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.clientItem}
                  onPress={() => {
                    onSelectClient(item?.id || '');
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.clientName}>{item?.nome || ''}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: theme.colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  picker: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerError: {
    borderColor: theme.colors.error,
  },
  pickerText: {
    ...typography.body,
    color: theme.colors.text,
  },
  placeholderText: {
    color: theme.colors.textMuted,
  },
  errorText: {
    ...typography.caption,
    color: theme.colors.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.lg,
    maxHeight: '70%',
  },
  modalTitle: {
    ...typography.heading,
    color: theme.colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  clientItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  clientName: {
    ...typography.body,
    color: theme.colors.text,
  },
});
