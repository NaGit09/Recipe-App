import { useProfile } from "@/src/hooks/useProfile";
import { BankCard } from "@/src/types/bank.type";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Surface,
  TextInput,
  useTheme,
} from "react-native-paper";

const BankCardItem = () => {
  const { bankCard, updateBankCard } = useProfile();
  const theme = useTheme();
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false);

  // Modal State
  const [visible, setVisible] = useState(false);
  const [editForm, setEditForm] = useState<BankCard>(bankCard);

  useEffect(() => {
    if (bankCard) {
      setEditForm(bankCard);
    }
  }, [bankCard]);

  const showModal = () => {
    setEditForm(bankCard);
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  const { bankName, cardNumber, ownerName } = bankCard;

  const getMaskedCardNumber = (number: string) => {
    if (isCardNumberVisible) return number;
    const last4 = number.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const handleSave = async () => {
    if (!editForm.bankName || !editForm.cardNumber || !editForm.ownerName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const success = await updateBankCard(editForm);
    if (success) {
      hideModal();
    } else {
      Alert.alert("Error", "Failed to save bank card");
    }
  };

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Debit Card
      </Text>

      <Surface
        style={[styles.bankCard, { backgroundColor: theme.colors.surface }]}
        elevation={3}
      >
        <View style={styles.bankRow}>
          <MaterialCommunityIcons
            name="credit-card-outline"
            size={36}
            color={theme.colors.primary}
          />

          <View style={styles.bankInfo}>
            <Text style={[styles.bankName, { color: theme.colors.onSurface }]}>
              {bankName}
            </Text>
            <View style={styles.cardNumberContainer}>
              <Text
                style={[styles.bankNumber, { color: theme.colors.secondary }]}
              >
                {getMaskedCardNumber(cardNumber)}
              </Text>
              <TouchableOpacity
                onPress={() => setIsCardNumberVisible(!isCardNumberVisible)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name={isCardNumberVisible ? "eye-off" : "eye"}
                  size={20}
                  color={theme.colors.secondary}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.bankOwner,
                { color: theme.colors.onSurfaceDisabled },
              ]}
            >
              {ownerName}
            </Text>
          </View>

          <Button
            mode="text"
            textColor={theme.colors.primary}
            onPress={showModal}
          >
            Edit
          </Button>
        </View>
      </Surface>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
            Edit Card Details
          </Text>

          <TextInput
            label="Bank Name"
            value={editForm.bankName}
            onChangeText={(text) =>
              setEditForm((prev) => ({ ...prev, bankName: text }))
            }
            mode="outlined"
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
          />

          <TextInput
            label="Card Number"
            value={editForm.cardNumber}
            onChangeText={(text) =>
              setEditForm((prev) => ({ ...prev, cardNumber: text }))
            }
            mode="outlined"
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            keyboardType="numeric"
            textColor={theme.colors.onSurface}
          />

          <TextInput
            label="Card Holder Name"
            value={editForm.ownerName}
            onChangeText={(text) =>
              setEditForm((prev) => ({ ...prev, ownerName: text }))
            }
            mode="outlined"
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
          />

          <View style={styles.modalActions}>
            <Button onPress={hideModal} textColor={theme.colors.secondary}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={[
                styles.saveButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              Save Changes
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },

  bankCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  bankRow: { flexDirection: "row", alignItems: "center" },
  bankInfo: { flex: 1, marginLeft: 12 },
  bankName: { fontSize: 16, fontWeight: "bold" },
  cardNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  bankNumber: {},
  bankOwner: { fontSize: 12 },

  // Modal Styles
  modalContainer: {
    padding: 24,
    margin: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  saveButton: {},
});
export default BankCardItem;
