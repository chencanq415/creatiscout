"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export type EmployeePlan = "free" | "plus" | "pro" | "enterprise";
export type AccountRole = "brand" | "creator";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  workspaceName: string;
  employeePlan: EmployeePlan | null;
  role?: AccountRole;
};

type StoredUser = AuthUser & { password: string };

type RegisterInput = {
  name: string;
  workspaceName: string;
  email: string;
  password: string;
  role?: AccountRole;
};

type AuthResult = { ok: true } | { ok: false; error: "invalid" | "exists" };

interface AuthState {
  users: StoredUser[];
  currentUser: AuthUser | null;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  login: (email: string, password: string) => AuthResult;
  loginDemo: () => void;
  register: (input: RegisterInput) => AuthResult;
  loginWithGoogle: (role: AccountRole) => void;
  resetPassword: (email: string, password: string) => AuthResult;
  logout: () => void;
  updateCurrentUser: (patch: Partial<Pick<AuthUser, "name" | "email" | "workspaceName">>) => void;
  setEmployeePlan: (plan: EmployeePlan) => void;
}

const demoUser: StoredUser = {
  id: "demo-user",
  name: "Alex Morgan",
  email: "demo@creatiscout.ai",
  workspaceName: "Demo Workspace",
  password: "demo123",
  employeePlan: null,
  role: "brand",
};

function publicUser(user: StoredUser): AuthUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [demoUser],
      currentUser: null,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = get().users.find(
          (candidate) =>
            candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
        );
        if (!user) return { ok: false, error: "invalid" };
        set({ currentUser: publicUser(user) });
        return { ok: true };
      },
      loginDemo: () => {
        const user = get().users.find((candidate) => candidate.id === demoUser.id) ?? demoUser;
        set({ currentUser: publicUser(user) });
      },
      register: (input) => {
        const normalizedEmail = input.email.trim().toLowerCase();
        if (get().users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
          return { ok: false, error: "exists" };
        }
        const user: StoredUser = {
          id: `user-${Date.now()}`,
          name: input.name.trim(),
          workspaceName: input.workspaceName.trim(),
          email: normalizedEmail,
          password: input.password,
          employeePlan: null,
          role: input.role,
        };
        set((state) => ({ users: [...state.users, user], currentUser: publicUser(user) }));
        return { ok: true };
      },
      loginWithGoogle: (role) => {
        const email = `google.${role}@creatiscout.mock`;
        const existing = get().users.find((user) => user.email === email);
        if (existing) {
          set({ currentUser: publicUser(existing) });
          return;
        }
        const user: StoredUser = {
          id: `google-${role}-${Date.now()}`,
          name: role === "brand" ? "Brand Team" : "Creator",
          workspaceName: role === "brand" ? "Brand Workspace" : "Creator Workspace",
          email,
          password: "google-mock-account",
          employeePlan: null,
          role,
        };
        set((state) => ({ users: [...state.users, user], currentUser: publicUser(user) }));
      },
      resetPassword: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!get().users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
          return { ok: false, error: "invalid" };
        }
        set((state) => ({
          users: state.users.map((user) =>
            user.email.toLowerCase() === normalizedEmail ? { ...user, password } : user,
          ),
        }));
        return { ok: true };
      },
      logout: () => set({ currentUser: null }),
      updateCurrentUser: (patch) =>
        set((state) => {
          if (!state.currentUser) return state;
          const currentUser = { ...state.currentUser, ...patch };
          return {
            currentUser,
            users: state.users.map((user) =>
              user.id === currentUser.id ? { ...user, ...patch } : user,
            ),
          };
        }),
      setEmployeePlan: (plan) =>
        set((state) => {
          if (!state.currentUser) return state;
          const currentUser = { ...state.currentUser, employeePlan: plan };
          return {
            currentUser,
            users: state.users.map((user) =>
              user.id === currentUser.id ? { ...user, employeePlan: plan } : user,
            ),
          };
        }),
    }),
    {
      name: "creatiscout.auth.v1",
      partialize: (state) => ({ users: state.users, currentUser: state.currentUser }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<AuthState>;
        const users = saved.users?.length ? saved.users : current.users;
        return { ...current, ...saved, users };
      },
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persistApi = useAuthStore.persist;
    if (!persistApi) {
      setHydrated(true);
      return;
    }
    let mounted = true;
    const finishHydration = () => {
      if (mounted) setHydrated(true);
    };
    const unsubscribe = persistApi.onFinishHydration(finishHydration);
    if (persistApi.hasHydrated()) {
      finishHydration();
    } else {
      try {
        const rehydration = persistApi.rehydrate();
        // In static deployments a storage read can fail silently. The app can
        // still continue to the sign-in or public-demo flow with an empty session.
        void Promise.resolve(rehydration).finally(finishHydration);
      } catch {
        finishHydration();
      }
    }
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return hydrated;
}
