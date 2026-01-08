export type NotificationType = "like" | "comment" | "follow" | "system" | "recipe";

export interface NotificationItem {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
    data?: {
        recipeId?: string;
        userId?: string;
        image?: string;
    };
}

export interface NotificationState {
    notifications: NotificationItem[];
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    getUnreadCount: () => number;
    // Optional: Function to add fake notification for testing
    addFakeNotification: () => void;
}
