import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, TextInput, useTheme } from "react-native-paper";

interface DeliveryAddressProps {
  address: string;
  setAddress: (address: string) => void;
}

const DeliveryAddress = ({ address, setAddress }: DeliveryAddressProps) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Delivery Address
      </Text>
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={1}
      >
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={24}
            color={theme.colors.primary}
          />
          <TextInput
            mode="outlined"
            value={address}
            onChangeText={setAddress}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            textColor={theme.colors.onSurface}
            outlineColor="transparent"
            activeOutlineColor="transparent"
          />
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    height: 40,
    fontSize: 14,
  },
});

export default DeliveryAddress;
