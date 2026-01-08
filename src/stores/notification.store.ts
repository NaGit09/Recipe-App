import { NotificationItem, NotificationState } from "@/src/types/notification.type";
import { create } from "zustand";

const FAKE_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "1",
        type: "like",
        title: "New Like",
        message: "John Doe liked your recipe 'Spicy Pasta'",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        read: false,
        data: {
            recipeId: "1",
            userId: "user1",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        },
    },
    {
        id: "2",
        type: "comment",
        title: "New Comment",
        message: "Sarah commented: 'This looks amazing! Can I swap...'",
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        read: false,
        data: {
            recipeId: "1",
            userId: "user2",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        },
    },
    {
        id: "3",
        type: "system",
        title: "Welcome!",
        message: "Welcome to Recipe App! Start exploring now.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
    },
    {
        id: "4",
        type: "recipe",
        title: "Recipe of the Day",
        message: "Check out this new trending recipe: 'Avocado Toast'",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true,
        data: {
            recipeId: "2",
            image: "https://images.unsplash.com/photo-1588137372308-15f75323ca8d",
        },
    },
    {
        id: "5",
        type: "follow",
        title: "New Follower",
        message: "Chef Gordon started following you",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        read: true,
        data: {
            userId: "user3",
            image: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
        },
    },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: FAKE_NOTIFICATIONS,

    markAsRead: (id: string) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
    },

    getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
    },

    addFakeNotification: () => {
        const newNotif: NotificationItem = {
            id: Math.random().toString(36).substr(2, 9),
            type: "system",
            title: "New Alert",
            message: `This is a test notification at ${new Date().toLocaleTimeString()}`,
            createdAt: new Date().toISOString(),
            read: false,
        };
        set((state) => ({
            notifications: [newNotif, ...state.notifications],
        }));
    },
}));
