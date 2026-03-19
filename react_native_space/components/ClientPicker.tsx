import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius } from '../app/constants/theme';
import { Client } from '../types';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const selectedClient = clients?.find((c) => c?.id === selectedClientId);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={[styles.picker, error && styles.pickerError]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerText, !selectedClient && styles.placeholderText]}>
          {selectedClient?.name || 'Selecione um cliente'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
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
                    onSelectClient?.(item?.id || '');
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.clientName}>{item?.name || ''}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.body,
      color: theme.text,
      marginBottom: spacing.xs,
      fontWeight: '600',
    },
    picker: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickerError: {
      borderColor: theme.error,
    },
    pickerText: {
      ...typography.body,
      color: theme.text,
    },
    placeholderText: {
      color: theme.textSecondary,
    },
    errorText: {
      ...typography.caption,
      color: theme.error,
      marginTop: spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingTop: spacing.lg,
      maxHeight: '70%',
    },
    modalTitle: {
      ...typography.heading,
      color: theme.text,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    clientItem: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    clientName: {
      ...typography.body,
      color: theme.text,
    },
  });
