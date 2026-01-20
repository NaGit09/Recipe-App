export interface AuthInfo {
    fullname: string;
    username: string;
    id: string;
}

export interface UserInfo {
    id: string;
    email: string;
    username: string;
    avatar: string;
    bio: string;
    role: string;
    favoriteRecipes: string[];
    createdAt: string;
}

export interface UserRes {
    token: string;
    user: UserInfo;
}

export interface UserState {
    user: UserInfo | null;
    users: UserInfo[];
    setUser: (user: UserInfo | null) => void;
    updateProfile: (user: UserInfo) => Promise<UserInfo | null>;
    getProfile: () => Promise<UserInfo | null>;
    getAllUsers: () => Promise<void>;
}
