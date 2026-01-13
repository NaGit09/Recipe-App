import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import { useThemeStore } from "../../stores/theme.store";

interface ThemeSelectorProps {
  visible: boolean;
  onDismiss: () => void;
}

const themeOptions = [
  { id: "light", name: "Light", color: "#DC2626", icon: "weather-sunny" },
  { id: "dark", name: "Dark", color: "#1F2937", icon: "weather-night" },
  { id: "ocean", name: "Ocean", color: "#0284C7", icon: "water" },
  { id: "forest", name: "Forest", color: "#059669", icon: "tree" },
];

export const ThemeSelector = ({ visible, onDismiss }: ThemeSelectorProps) => {
  const { themeName, setTheme } = useThemeStore();
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          Choose Theme
        </Text>

        <View style={styles.grid}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                {
                  backgroundColor:
                    themeName === option.id
                      ? theme.colors.primaryContainer
                      : theme.colors.surface,
                  borderColor:
                    themeName === option.id ? theme.colors.primary : "#E5E7EB",
                },
              ]}
              onPress={() => setTheme(option.id)}
            >
              <View
                style={[styles.colorPreview, { backgroundColor: option.color }]}
              />
              <MaterialCommunityIcons
                name={option.icon as any}
                size={24}
                color={
                  themeName === option.id
                    ? theme.colors.primary
                    : theme.colors.secondary
                }
              />
              <Text
                style={[
                  styles.optionLabel,
                  {
                    color:
                      themeName === option.id
                        ? theme.colors.primary
                        : theme.colors.onSurface,
                    fontWeight: themeName === option.id ? "bold" : "normal",
                  },
                ]}
              >
                {option.name}
              </Text>

              {themeName === option.id && (
                <View style={styles.checkIcon}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Button mode="contained" onPress={onDismiss} style={{ marginTop: 20 }}>
          Done
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    margin: 20,
    borderRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  optionCard: {
    width: "45%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    gap: 8,
    position: "relative",
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
  },
  checkIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
