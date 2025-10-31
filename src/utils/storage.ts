import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStorage {
    private static instance: LocalStorage;

    private constructor() { } 

    public static getInstance(): LocalStorage {
        if (!LocalStorage.instance) {
            LocalStorage.instance = new LocalStorage();
        }
        return LocalStorage.instance;
    }

    async getItem(itemName: string): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(itemName);
        } catch (error) {
            console.error('Error getting item:', error);
            return null;
        }
    }

    async setItem(itemName: string, item: string): Promise<void> {
        try {
            await AsyncStorage.setItem(itemName, item);
        } catch (error) {
            console.error('Error setting token:', error);
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}

export const StorageInstance = LocalStorage.getInstance();
