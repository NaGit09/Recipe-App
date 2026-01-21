import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

interface ProfileSettingItemProps {
  icon: string;
  label: string;
  value?: boolean;
  onPress: () => void;
  isSwitch?: boolean;
}

const ProfileSettingItem: React.FC<ProfileSettingItemProps> = ({
  icon,
  label,
  value = false,
  onPress,
  isSwitch = false,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={isSwitch ? undefined : onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        >
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
        <Text style={[styles.settingLabel, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onPress as any}
          trackColor={{ false: "#D1D5DB", true: theme.colors.primary }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
        />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.onSurfaceDisabled}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ProfileSettingItem;
