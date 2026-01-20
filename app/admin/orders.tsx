import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Searchbar, SegmentedButtons, useTheme } from "react-native-paper";
import OrderItem from "./components/OrderItem";

// Mock Orders
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    customer: "John Doe",
    total: 45.5,
    status: "PENDING",
    date: "2023-10-25",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    total: 120.0,
    status: "SUCCESS",
    date: "2023-10-24",
    items: 5,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    total: 15.0,
    status: "CANCELLED",
    date: "2023-10-24",
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    total: 60.25,
    status: "PENDING",
    date: "2023-10-23",
    items: 2,
  },
  {
    id: "ORD-005",
    customer: "Chris Lee",
    total: 32.8,
    status: "SUCCESS",
    date: "2023-10-22",
    items: 4,
  },
];

export default function OrderManagementScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [orders, setOrders] = React.useState(MOCK_ORDERS);

  React.useEffect(() => {
    let filtered = MOCK_ORDERS;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setOrders(filtered);
  }, [searchQuery, statusFilter]);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const renderOrderItem = ({ item }: { item: (typeof MOCK_ORDERS)[0] }) => {
    return (
      <OrderItem item={item} onPress={(id) => console.log("View Order", id)} />
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        placeholder="Search orders"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <SegmentedButtons
        value={statusFilter}
        onValueChange={setStatusFilter}
        style={styles.segment}
        buttons={[
          {
            value: "ALL",
            label: "All",
          },
          {
            value: "PENDING",
            label: "Pending",
          },
          {
            value: "SUCCESS",
            label: "Success",
          },
          {
            value: "CANCELLED",
            label: "Cancelled",
          },
        ]}
      />

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
    backgroundColor: "#fff",
  },
  segment: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});
