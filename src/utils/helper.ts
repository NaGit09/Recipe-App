import { router } from "expo-router";
import { NotificationType } from "../types/notification.type";

export const handleSeeAll = (reset: () => void) => {
    reset();
    router.push("/(tabs)/search");
};

export const handleCategoryPress = (categoryId: string, setActiveCategory: (categoryId: string) => void) => {
    setActiveCategory(categoryId);
    router.push("/(tabs)/search");
};

export const handleRecipePress = (recipeId: string) => {
    router.push(`/recipe/${recipeId}`);
};

export const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

export const getIconColor = (type: NotificationType) => {
    switch (type) {
        case "like":
            return "#EF4444";
        case "comment":
            return "#3B82F6";
        case "follow":
            return "#10B981";
        case "recipe":
            return "#F59E0B";
        default:
            return "#6B7280";
    }
};

export const getIcon = (type: NotificationType) => {
    switch (type) {
        case "like":
            return "heart";
        case "comment":
            return "comment-text";
        case "follow":
            return "account-plus";
        case "recipe":
            return "chef-hat";
        case "system":
        default:
            return "bell";
    }
};