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
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const theme = useTheme();
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <IconButton
          icon="arrow-left"
          onPress={() => router.back()}
          iconColor={theme.colors.onSurface}
        />
        <Text
          variant="titleLarge"
          style={[styles.headerTitle, { color: theme.colors.onSurface }]}
        >
          Create Recipe
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Image Upload */}
        <TouchableOpacity
          style={[
            styles.imageUpload,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
            >
              <Feather
                name="camera"
                size={32}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[styles.uploadText, { color: theme.colors.primary }]}
              >
                Add Cover Photo
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          label="Recipe Name"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: theme.colors.surface }]}
          outlineColor={theme.colors.outline}
          activeOutlineColor={theme.colors.primary}
          textColor={theme.colors.onSurface}
        />

        <TextInput
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={[styles.input, { backgroundColor: theme.colors.surface }]}
          outlineColor={theme.colors.outline}
          activeOutlineColor={theme.colors.primary}
          textColor={theme.colors.onSurface}
        />

        <View style={styles.row}>
          <TextInput
            label="Time (mins)"
            mode="outlined"
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
            style={[
              styles.input,
              {
                flex: 1,
                marginRight: 8,
                backgroundColor: theme.colors.surface,
              },
            ]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          Category
        </Text>
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
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outline,
                },
                categoryId === c.id && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                },
              ]}
              onPress={() => setCategoryId(c.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  { color: theme.colors.onSurface },
                  categoryId === c.id && { color: theme.colors.onPrimary },
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
          style={[styles.input, { backgroundColor: theme.colors.surface }]}
          placeholder="Step 1: ..."
          outlineColor={theme.colors.outline}
          activeOutlineColor={theme.colors.primary}
          textColor={theme.colors.onSurface}
          placeholderTextColor={theme.colors.onSurfaceDisabled}
        />

        {/* Ingredients Section */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Ingredients
          </Text>
          <Button
            mode="text"
            onPress={() => setIngredientModalVisible(true)}
            textColor={theme.colors.primary}
          >
            + Add
          </Button>
        </View>
        {selectedIngredients.map((item, index) => (
          <View
            key={item.ingredient.id}
            style={[
              styles.listItem,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <Text style={{ flex: 1, color: theme.colors.onSurface }}>
              {item.ingredient.name} ({item.ingredient.unit})
            </Text>
            <TextInput
              mode="outlined"
              value={item.quantity}
              onChangeText={(txt) => updateIngredientQuantity(index, txt)}
              keyboardType="numeric"
              style={[
                styles.qtyInput,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              dense
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              textColor={theme.colors.onSurface}
            />
            <IconButton
              icon="close"
              size={20}
              iconColor={theme.colors.error}
              onPress={() => handleRemoveIngredient(index)}
            />
          </View>
        ))}

        {/* Nutrition Section */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Nutrition
          </Text>
          <Button
            mode="text"
            onPress={() => setNutritionModalVisible(true)}
            textColor={theme.colors.primary}
          >
            + Add
          </Button>
        </View>
        {selectedNutritions.map((item, index) => (
          <View
            key={item.nutrition.id}
            style={[
              styles.listItem,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <Text style={{ flex: 1, color: theme.colors.onSurface }}>
              {item.nutrition.name} ({item.nutrition.unit})
            </Text>
            <TextInput
              mode="outlined"
              value={item.value}
              onChangeText={(txt) => updateNutritionValue(index, txt)}
              keyboardType="numeric"
              style={[
                styles.qtyInput,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              dense
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              textColor={theme.colors.onSurface}
            />
            <IconButton
              icon="close"
              size={20}
              iconColor={theme.colors.error}
              onPress={() => handleRemoveNutrition(index)}
            />
          </View>
        ))}

        <Button
          mode="contained"
          onPress={handleCreate}
          loading={loading}
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
          ]}
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ color: theme.colors.onPrimary }}
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
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
              Select Ingredient
            </Text>
            <IconButton
              icon="close"
              iconColor={theme.colors.onSurface}
              onPress={() => setIngredientModalVisible(false)}
            />
          </View>
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  { borderBottomColor: theme.colors.outlineVariant },
                ]}
                onPress={() => handleAddIngredient(item)}
              >
                <Text style={{ color: theme.colors.onSurface }}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.colors.secondary, fontSize: 12 }}>
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
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
              Select Nutrition
            </Text>
            <IconButton
              icon="close"
              iconColor={theme.colors.onSurface}
              onPress={() => setNutritionModalVisible(false)}
            />
          </View>
          <FlatList
            data={nutritions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  { borderBottomColor: theme.colors.outlineVariant },
                ]}
                onPress={() => handleAddNutrition(item)}
              >
                <Text style={{ color: theme.colors.onSurface }}>
                  {item.name}
                </Text>
                <Text style={{ color: theme.colors.secondary, fontSize: 12 }}>
                  {item.type}
                </Text>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    marginTop: 12,
    fontWeight: "600",
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
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
    marginRight: 10,
    borderWidth: 1,
  },
  categoryChipText: {
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 40,
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyInput: {
    width: 80,
    height: 48,
    marginHorizontal: 8,
    fontSize: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
