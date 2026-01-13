import { create } from 'zustand';
import { AppTheme, themes } from '../styles/themes';
import { StorageInstance } from '../utils/storage';

interface ThemeState {
    themeName: string;
    theme: AppTheme;
    setTheme: (name: string) => Promise<void>;
    loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
    themeName: 'light',
    theme: themes.light,
    setTheme: async (name: string) => {
        const newTheme = themes[name] || themes.light;
        set({ themeName: name, theme: newTheme });
        await StorageInstance.setItem('app_theme', name);
    },
    loadTheme: async () => {
        const savedTheme = await StorageInstance.getItem('app_theme');
        if (savedTheme && themes[savedTheme]) {
            set({ themeName: savedTheme, theme: themes[savedTheme] });
        }
    },
}));
