import { useLocalSearch } from "@/src/hooks/useLocalSearch";
import { useUserStore } from "@/src/stores/user.store";
import { UserInfo } from "@/src/types/user.type";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  FAB,
  Portal,
  RadioButton,
  Searchbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import UserItem from "./components/UserItem";

export default function UserManagementScreen() {
  const theme = useTheme();
  const { users, getAllUsers } = useUserStore();

  useEffect(() => {
    getAllUsers();
  }, []);

  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredUsers,
  } = useLocalSearch(
    users,
    (u, query) =>
      (u.username?.toLowerCase() || "").includes(query.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(query.toLowerCase()),
  );

  // Edit/Add Modal State
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInfo | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("User");
  const [editStatus, setEditStatus] = useState("Active");
  const [editEmail, setEditEmail] = useState("");

  const showDialog = (user: UserInfo | null) => {
    setEditingUser(user);
    if (user) {
      setEditName(user.username);
      setEditEmail(user.email);
      setEditRole(user.role);
    } else {
      // Reset for new user
      setEditName("");
      setEditEmail("");
      setEditRole("User");
      setEditStatus("Active");
    }
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const handleSave = () => {
    // API integration for save/edit pending
    console.log("Save/Edit not fully implemented with API yet");
    hideDialog();
  };

  const renderUserItem = ({ item }: { item: UserInfo }) => (
    <UserItem
      item={item}
      onEdit={showDialog}
      onDelete={(id) => console.log("Delete not implemented in store yet")}
    />
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        placeholder="Search users"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>{editingUser ? "Edit User" : "Add User"}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editName}
              onChangeText={setEditName}
              style={{ marginBottom: 12 }}
              mode="outlined"
            />
            <TextInput
              label="Email"
              value={editEmail}
              onChangeText={setEditEmail}
              style={{ marginBottom: 16 }}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text
              variant="bodyMedium"
              style={{ marginBottom: 8, fontWeight: "bold" }}
            >
              Role
            </Text>
            <RadioButton.Group
              onValueChange={(newValue) => setEditRole(newValue)}
              value={editRole}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton value="User" />
                <Text>User</Text>
                <View style={{ width: 16 }} />
                <RadioButton value="Admin" />
                <Text>Admin</Text>
              </View>
            </RadioButton.Group>

            <Text
              variant="bodyMedium"
              style={{ marginTop: 16, marginBottom: 8, fontWeight: "bold" }}
            >
              Status
            </Text>
            <RadioButton.Group
              onValueChange={(newValue) => setEditStatus(newValue)}
              value={editStatus}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton value="Active" />
                <Text>Active</Text>
                <View style={{ width: 16 }} />
                <RadioButton value="Blocked" />
                <Text>Blocked</Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleSave} mode="contained">
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        label="Add User"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => showDialog(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    elevation: 4,
  },
});
