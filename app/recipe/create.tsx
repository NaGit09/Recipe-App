import { useCategoryStore } from "@/src/stores/category.store";
import { useIngredientStore } from "@/src/stores/ingredient.store";
import { useNutritionStore } from "@/src/stores/nutrition.store";
import { useRecipeStore } from "@/src/stores/recipe.store";
import { Ingredient } from "@/src/types/ingredient.type";
import { Nutrition } from "@/src/types/nutrition.type";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { createRecipe } = useRecipeStore();
  const { categories, getAllCategories } = useCategoryStore();
  const { ingredients, getAllIngredients } = useIngredientStore();
  const { nutritions, getAllNutritions } = useNutritionStore();

  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [instructions, setInstructions] = useState("");

  // Ingredients State
  const [selectedIngredients, setSelectedIngredients] = useState<
    { ingredient: Ingredient; quantity: string }[]
  >([]);
  const [ingredientModalVisible, setIngredientModalVisible] = useState(false);

  // Nutrition State
  const [selectedNutritions, setSelectedNutritions] = useState<
    { nutrition: Nutrition; value: string }[]
  >([]);
  const [nutritionModalVisible, setNutritionModalVisible] = useState(false);

  useEffect(() => {
    getAllCategories();
    getAllIngredients();
    getAllNutritions();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddIngredient = (ingredient: Ingredient) => {
    if (selectedIngredients.some((i) => i.ingredient.id === ingredient.id)) {
      Alert.alert("Already Added", "This ingredient is already in your list.");
      return;
    }
    setSelectedIngredients([
      ...selectedIngredients,
      { ingredient, quantity: "1" },
    ]);
    setIngredientModalVisible(false);
  };

  const handleRemoveIngredient = (index: number) => {
    const newList = [...selectedIngredients];
    newList.splice(index, 1);
    setSelectedIngredients(newList);
  };

  const updateIngredientQuantity = (index: number, qty: string) => {
    const newList = [...selectedIngredients];
    newList[index].quantity = qty;
    setSelectedIngredients(newList);
  };

  const handleAddNutrition = (nutrition: Nutrition) => {
    if (selectedNutritions.some((n) => n.nutrition.id === nutrition.id)) {
      Alert.alert(
        "Already Added",
        "This nutrition info is already in your list."
      );
      return;
    }
    setSelectedNutritions([...selectedNutritions, { nutrition, value: "0" }]);
    setNutritionModalVisible(false);
  };

  const handleRemoveNutrition = (index: number) => {
    const newList = [...selectedNutritions];
    newList.splice(index, 1);
    setSelectedNutritions(newList);
  };

  const updateNutritionValue = (index: number, val: string) => {
    const newList = [...selectedNutritions];
    newList[index].value = val;
    setSelectedNutritions(newList);
  };

  const handleCreate = async () => {
    if (!name || !description || !categoryId || !time || !image) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Desc, Time, Category, Image)"
      );
      return;
    }

    setLoading(true);
    try {
      // Backend likely expects specific structure for ingredients/nutrition
      // Assuming it expects arrays of objects with IDs and values
      const ingredientPayload = selectedIngredients.map((i) => ({
        ingredientId: i.ingredient.id,
        quantity: parseFloat(i.quantity) || 0,
      }));

      const nutritionPayload = selectedNutritions.map((n) => ({
        nutritionId: n.nutrition.id,
        value: parseFloat(n.value) || 0,
      }));

      const payload: any = {
        name,
        description,
        time: parseInt(time) || 0,
        categoryId,
        instructions,
        ingredients: ingredientPayload,
        nutritions: nutritionPayload,
      };

      // Handle Image
      if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : `image`;
        payload.image = { uri: image, name: filename, type } as any;
      }

      const result = await createRecipe(payload);
      if (result) {
        Alert.alert("Success", "Recipe created successfully!");
        router.back();
      } else {
        Alert.alert("Error", "Failed to create recipe.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleLarge" style={styles.headerTitle}>
          Create Recipe
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Image Upload */}
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="camera" size={32} color="#9CA3AF" />
              <Text style={styles.uploadText}>Add Cover Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          label="Recipe Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <View style={styles.row}>
          <TextInput
            label="Time (mins)"
            mode="outlined"
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
          />
        </View>

        <Text style={styles.sectionTitle}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.categoryChip,
                categoryId === c.id && styles.categoryChipSelected,
              ]}
              onPress={() => setCategoryId(c.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  categoryId === c.id && styles.categoryChipTextSelected,
                ]}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          label="Instructions"
          mode="outlined"
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={6}
          style={styles.input}
          placeholder="Step 1: ..."
        />

        {/* Ingredients Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Button mode="text" onPress={() => setIngredientModalVisible(true)}>
            + Add
          </Button>
        </View>
        {selectedIngredients.map((item, index) => (
          <View key={item.ingredient.id} style={styles.listItem}>
            <Text style={{ flex: 1 }}>
              {item.ingredient.name} ({item.ingredient.unit})
            </Text>
            <TextInput
              mode="outlined"
              value={item.quantity}
              onChangeText={(txt) => updateIngredientQuantity(index, txt)}
              keyboardType="numeric"
              style={styles.qtyInput}
              dense
            />
            <IconButton
              icon="close"
              size={20}
              onPress={() => handleRemoveIngredient(index)}
            />
          </View>
        ))}

        {/* Nutrition Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nutrition</Text>
          <Button mode="text" onPress={() => setNutritionModalVisible(true)}>
            + Add
          </Button>
        </View>
        {selectedNutritions.map((item, index) => (
          <View key={item.nutrition.id} style={styles.listItem}>
            <Text style={{ flex: 1 }}>
              {item.nutrition.name} ({item.nutrition.unit})
            </Text>
            <TextInput
              mode="outlined"
              value={item.value}
              onChangeText={(txt) => updateNutritionValue(index, txt)}
              keyboardType="numeric"
              style={styles.qtyInput}
              dense
            />
            <IconButton
              icon="close"
              size={20}
              onPress={() => handleRemoveNutrition(index)}
            />
          </View>
        ))}

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          style={styles.submitButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          Create Recipe
        </Button>
      </ScrollView>

      {/* Ingredient Selection Modal */}
      <Modal
        visible={ingredientModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIngredientModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text variant="titleMedium">Select Ingredient</Text>
            <IconButton
              icon="close"
              onPress={() => setIngredientModalVisible(false)}
            />
          </View>
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleAddIngredient(item)}
              >
                <Text>{item.name}</Text>
                <Text style={{ color: "gray", fontSize: 12 }}>
                  Unit: {item.unit}
                </Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Nutrition Selection Modal */}
      <Modal
        visible={nutritionModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNutritionModalVisible(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <Text variant="titleMedium">Select Nutrition</Text>
            <IconButton
              icon="close"
              onPress={() => setNutritionModalVisible(false)}
            />
          </View>
          <FlatList
            data={nutritions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleAddNutrition(item)}
              >
                <Text>{item.name}</Text>
                <Text style={{ color: "gray", fontSize: 12 }}>{item.type}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontWeight: "bold",
    color: "#1F2937",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  imageUpload: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DBEAFE",
    borderStyle: "dashed",
    borderRadius: 16,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    marginTop: 12,
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
  },
  categoryScroll: {
    marginBottom: 20,
    flexDirection: "row",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipSelected: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
    elevation: 2,
  },
  categoryChipText: {
    color: "#4B5563",
    fontWeight: "600",
  },
  categoryChipTextSelected: {
    color: "#fff",
  },
  submitButton: {
    marginTop: 40,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyInput: {
    width: 80,
    height: 48,
    backgroundColor: "#F9FAFB",
    marginHorizontal: 8,
    fontSize: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#fff",
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
