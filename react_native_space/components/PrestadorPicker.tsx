import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, borderRadius } from '../app/constants/theme';
import { Prestador } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface PrestadorPickerProps {
  prestadores?: Prestador[];
  value?: Prestador | null;
  onChange?: (prestador: Prestador | null) => void;
  label?: string;
  error?: string;
}

export function PrestadorPicker({
  prestadores,
  value,
  onChange,
  label,
  error,
}: PrestadorPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        style={[styles.picker, error ? styles.pickerError : null]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerText, !value ? styles.placeholderText : null]}>
          {value?.name ?? 'Selecione um prestador'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Prestador</Text>
            <FlatList
              data={prestadores}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum prestador disponivel</Text>}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.item}
                  onPress={() => {
                    onChange?.(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSub}>CPF: {item.cpf}</Text>
                  <Text style={styles.itemSub}>Placa: {item.vehiclePlate}</Text>
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
    container: { marginBottom: spacing.md },
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
    pickerError: { borderColor: theme.error },
    pickerText: { ...typography.body, color: theme.text },
    placeholderText: { color: theme.textSecondary },
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
    item: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    itemName: { ...typography.body, color: theme.text, fontWeight: '600' },
    itemSub: { ...typography.caption, color: theme.textSecondary },
    emptyText: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
  });
