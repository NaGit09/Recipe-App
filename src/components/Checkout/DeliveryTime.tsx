import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";

const DeliveryTime = () => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        Delivery Time
      </Text>
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={1}
      >
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={theme.colors.primary}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
              Standard Delivery
            </Text>
            <Text style={{ color: theme.colors.secondary }}>30 - 45 mins</Text>
          </View>
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
});

export default DeliveryTime;
