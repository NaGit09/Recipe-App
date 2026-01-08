export interface Nutrition {
    id: string;
    name: string;
    unit: string;
    type: string;
}

export interface NutritionItem {
    nutrition: Nutrition;
    value: number;
}

export interface NutritionState {
    nutritions: Nutrition[];
    activeNutrition: Nutrition | null;
    nutritionTypes: string[];
    loading: boolean;
    error: string | null;

    setNutritions: (nutritions: Nutrition[]) => void;
    getAllNutritions: () => Promise<void>;
    getAllNutritionTypes: () => Promise<void>;
    getNutritionById: (id: string) => Promise<void>;
    createNutrition: (nutrition: Nutrition) => Promise<void>;
    updateNutrition: (id: string, nutrition: Nutrition) => Promise<void>;
    deleteNutrition: (id: string) => Promise<void>;
}