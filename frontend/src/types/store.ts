import type { User } from "./user";

export interface AuthState {
    fetchUser(): unknown;
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    likedSongs: string[]; // mảng ID bài hát đã thích
    setLikedSongs: (songs: string[]) => void;

    setAccessToken(accessToken: string): void;
    clearState: () => void;

    signUp: (
        username: string,
        password: string,
        email: string,
        firstName: string,
        lastName: string
    ) => Promise<void>;

    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    // getMe: () => Promise<void>;
    refresh: () => Promise<void>;
}