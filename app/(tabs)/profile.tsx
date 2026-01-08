import { useAuthStore } from "@/src/stores/auth.store";
import { useUserStore } from "@/src/stores/user.store";
import { UserInfo } from "@/src/types/user.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";

const { width } = Dimensions.get("window");

type BankCard = {
  bankName: string;
  cardNumber: string;
  ownerName: string;
};

const ProfileScreen = () => {
  const { user, getProfile, updateProfile } = useUserStore();
  const { logout } = useAuthStore();

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

  const handleEditBankCard = () => {
    Alert.alert("Edit Bank Card", "Feature coming soon");
  };

  if (loading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Profile
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Surface style={styles.profileCard} elevation={4}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={{
                uri: formData.avatar || "https://via.placeholder.com/100",
              }}
              style={{ backgroundColor: "#E5E7EB" }}
            />
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="camera" size={16} color="#fff" />
            </View>
          </View>

          <Text variant="titleLarge" style={styles.username}>
            {formData.username || "User"}
          </Text>
          <Text variant="bodyMedium" style={styles.role}>
            {formData.role || "Member"}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </Surface>

        {/* Personal Info */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <TextInput
            label="Username"
            value={formData.username}
            onChangeText={(text) =>
              setFormData({ ...formData, username: text })
            }
            mode="outlined"
            style={styles.input}
            outlineColor="#E5E7EB"
            activeOutlineColor="#DC2626"
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Email"
            value={formData.email}
            mode="outlined"
            disabled
            style={styles.input}
            outlineColor="#E5E7EB"
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Bio"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            outlineColor="#E5E7EB"
            activeOutlineColor="#DC2626"
          />

          {/* Bank Card */}
          <Text style={styles.sectionTitle}>Default Bank Card</Text>

          <Surface style={styles.bankCard} elevation={3}>
            <View style={styles.bankRow}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={36}
                color="#DC2626"
              />

              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{bankCard.bankName}</Text>
                <Text style={styles.bankNumber}>{bankCard.cardNumber}</Text>
                <Text style={styles.bankOwner}>{bankCard.ownerName}</Text>
              </View>

              <Button
                mode="text"
                textColor="#DC2626"
                onPress={handleEditBankCard}
              >
                Edit
              </Button>
            </View>
          </Surface>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleUpdate}
              loading={saving}
              disabled={saving}
              style={styles.primaryButton}
            >
              Update Profile
            </Button>

            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              textColor="#EF4444"
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
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerBackground: {
    height: 180,
    backgroundColor: "#DC2626",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 60,
  },
  headerContent: { alignItems: "center" },
  headerTitle: { color: "#fff", fontWeight: "bold" },

  scrollContent: {
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },

  avatarContainer: { marginBottom: 16 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#DC2626",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  username: { fontWeight: "bold", color: "#1F2937" },
  role: { color: "#6B7280", marginBottom: 20 },

  statsRow: { flexDirection: "row", width: "100%" },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#6B7280" },
  statDivider: { width: 1, backgroundColor: "#E5E7EB" },

  formSection: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },

  input: { backgroundColor: "#fff", marginBottom: 16 },

  bankCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  bankRow: { flexDirection: "row", alignItems: "center" },
  bankInfo: { flex: 1, marginLeft: 12 },
  bankName: { fontSize: 16, fontWeight: "bold" },
  bankNumber: { color: "#6B7280" },
  bankOwner: { fontSize: 12, color: "#9CA3AF" },

  buttonContainer: { gap: 12 },
  primaryButton: { backgroundColor: "#DC2626", borderRadius: 12 },
  logoutButton: {
    borderRadius: 12,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
  },
});

export default ProfileScreen;
