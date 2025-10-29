import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLocalToken = async (tokenType : string) => {
    return await AsyncStorage.getItem(tokenType);
};

export const updateLocalToken = async(tokenType : string ,token : string ) => {
    await AsyncStorage.setItem(tokenType, token);
};
