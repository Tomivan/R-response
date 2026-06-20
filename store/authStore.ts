import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role?: 'admin' | 'user';
  photoURL?: string;
  department?: string;
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);