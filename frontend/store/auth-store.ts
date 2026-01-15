import api from "@/lib/http";
import { logout as clearSession, setToken } from "@/lib/sessions";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type User = {
  name: string;
  email: string;
};

interface AuthState {
  user: User | null;
  token: string | null;

  setToken: (token: string) => void;
  setUser: (user: User) => void;

  login: (data: { user: User; token: string }) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setToken: (token: string) => set({ token }),
      setUser: (user: User) => set({ user }),

      login: ({ user, token }) => {
        set({ user, token });
        setToken(token); // simpan ke cookie (server action)
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout API call failed:", error);
        } finally {
          set({ user: null, token: null });
          await clearSession(); // hapus cookie session
          window.location.replace("/login");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
