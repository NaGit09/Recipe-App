import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

export type AppTheme = MD3Theme & {
    colors: {
        customColor?: string;
    }
};

export const LightTheme: AppTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#DC2626', // Red-600
        primaryContainer: '#FEF2F2', // Red-50
        secondary: '#4B5563', // Gray-600
        background: '#F9FAFB', // Gray-50
        surface: '#FFFFFF',
        error: '#EF4444',
        errorContainer: '#FEF2F2', // Red-50
        outline: '#E5E7EB', // Gray-200
        outlineVariant: '#F3F4F6', // Gray-100
        surfaceVariant: '#F9FAFB', // Gray-50
        onSurfaceVariant: '#4B5563', // Gray-600
        customColor: '#DC2626',
    },
};

export const DarkTheme: AppTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#EF4444', // Red-500
        primaryContainer: '#7F1D1D', // Red-900
        secondary: '#9CA3AF', // Gray-400
        background: '#111827', // Gray-900
        surface: '#1F2937', // Gray-800
        error: '#F87171',
        errorContainer: '#450A0A', // Red-950
        outline: '#374151', // Gray-700
        outlineVariant: '#1F2937', // Gray-800
        surfaceVariant: '#111827', // Gray-900
        onSurfaceVariant: '#9CA3AF', // Gray-400
        customColor: '#EF4444',
    },
};

export const OceanTheme: AppTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#0284C7', // Sky-600
        primaryContainer: '#F0F9FF', // Sky-50
        secondary: '#475569', // Slate-600
        background: '#F8FAFC', // Slate-50
        surface: '#FFFFFF',
        error: '#EF4444',
        errorContainer: '#FEF2F2', // Red-50
        outline: '#E5E7EB', // Slate-200
        outlineVariant: '#F1F5F9', // Slate-100
        surfaceVariant: '#F8FAFC', // Slate-50
        onSurfaceVariant: '#475569', // Slate-600
        customColor: '#0284C7',
    },
};

export const ForestTheme: AppTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#059669', // Emerald-600
        primaryContainer: '#ECFDF5', // Emerald-50
        secondary: '#4B5563',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        error: '#EF4444',
        errorContainer: '#FEF2F2', // Red-50
        outline: '#E5E7EB',
        outlineVariant: '#F3F4F6',
        surfaceVariant: '#F9FAFB',
        onSurfaceVariant: '#4B5563',
        customColor: '#059669',
    },
};

export const themes: Record<string, AppTheme> = {
    light: LightTheme,
    dark: DarkTheme,
    ocean: OceanTheme,
    forest: ForestTheme,
};
