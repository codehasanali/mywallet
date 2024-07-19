import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    user: string | null;
    login: (username: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    login: async (username: string) => {
        try {
            await AsyncStorage.setItem('user', username);
            set({ user: username });
        } catch (error) {
            console.error('Login error:', error);
        }
    },
    logout: async () => {
        try {
            await AsyncStorage.removeItem('user');
            set({ user: null });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },
    checkAuth: async () => {
        try {
            const user = await AsyncStorage.getItem('user');
            set({ user });
        } catch (error) {
            console.error('Check auth error:', error);
        }
    },
}));

export default useAuthStore;