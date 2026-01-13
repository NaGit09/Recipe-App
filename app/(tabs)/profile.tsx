import BankCardItem from "@/src/components/Profile/BankCard";
import PersonalInfo from "@/src/components/Profile/PersonalInfo";
import ProfileCart from "@/src/components/Profile/ProfileCart";
import ProfileSettings from "@/src/components/Profile/ProfileSettings";
import { useAuthStore } from "@/src/stores/auth.store";
import { useUserStore } from "@/src/stores/user.store";
import { UserInfo } from "@/src/types/user.type";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";

type BankCard = {
  bankName: string;
  cardNumber: string;
  ownerName: string;
};

const ProfileScreen = () => {
  const { user, getProfile, updateProfile } = useUserStore();
  const { logout } = useAuthStore();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserInfo>>({});

  // Thẻ ngân hàng mặc định (mock)
  const [bankCard, setBankCard] = useState<BankCard>({
    bankName: "Vietcombank",
    cardNumber: "**** **** **** 1234",
    ownerName: "Card Holder",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userData = await getProfile();
      if (userData) {
        setFormData(userData);
        setBankCard((prev) => ({
          ...prev,
          ownerName: userData.username || prev.ownerName,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.username) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    setSaving(true);
    try {
      if (user) {
        await updateProfile({ ...user, ...formData } as UserInfo);
        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  if (loading && !user) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text
            variant="headlineMedium"
            style={[styles.headerTitle, { color: theme.colors.onPrimary }]}
          >
            Profile
          </Text>
        </View>

        {/* Content Sheet */}
        <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
          <View style={styles.profileCardWrapper}>
            <ProfileCart formData={formData} />
          </View>

          <View style={styles.sectionSpacer} />

          <PersonalInfo formData={formData} setFormData={setFormData} />
          <BankCardItem />
          <ProfileSettings />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleUpdate}
              loading={saving}
              disabled={saving}
              style={[
                styles.primaryButton,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              Update Profile
            </Button>

            <Button
              mode="outlined"
              onPress={handleLogout}
              style={[
                styles.logoutButton,
                {
                  borderColor: theme.colors.errorContainer,
                  backgroundColor: theme.colors.errorContainer,
                },
              ]}
              textColor={theme.colors.error}
              icon="logout"
            >
              Logout
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }, // Background color handled dynamically
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 60,
  },
  headerTitle: { fontWeight: "bold" }, // Color handled dynamically

  sheet: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  profileCardWrapper: {
    marginTop: -40,
  },
  sectionSpacer: {
    height: 10,
  },

  buttonContainer: { gap: 12, marginTop: 10, marginBottom: 20 },
  primaryButton: { borderRadius: 12 },
  logoutButton: {
    borderRadius: 12,
  },
});

export default ProfileScreen;
