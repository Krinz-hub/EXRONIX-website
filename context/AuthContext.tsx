"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type UpdateUserData = {
  name?: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (
    data: UpdateUserData
  ) => Promise<User | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,

  refreshUser: async () => {},

  updateUser: async () => null,

  logout: async () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================================
     REFRESH CURRENT USER
  ========================================= */

  async function refreshUser(): Promise<void> {
    try {
      const {
        data,
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(
          "Refresh user error:",
          error
        );

        setUser(null);
        return;
      }

      setUser(data.user ?? null);
    } catch (error) {
      console.error(
        "Unexpected refresh user error:",
        error
      );

      setUser(null);
    }
  }

  /* =========================================
     UPDATE USER PROFILE
  ========================================= */

  async function updateUser(
    data: UpdateUserData
  ): Promise<User | null> {
    try {
      const {
        data: result,
        error,
      } = await supabase.auth.updateUser({
        data: {
          name: data.name ?? "",
          phone: data.phone ?? "",
        },
      });

      if (error) {
        console.error(
          "Update user error:",
          error
        );

        throw error;
      }

      if (result.user) {
        setUser(result.user);
      }

      return result.user ?? null;
    } catch (error) {
      console.error(
        "Failed to update user:",
        error
      );

      throw error;
    }
  }

  /* =========================================
     LOGOUT
  ========================================= */

  async function logout(): Promise<void> {
    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "Logout error:",
          error
        );

        throw error;
      }

      setUser(null);
    } catch (error) {
      console.error(
        "Failed to logout:",
        error
      );

      throw error;
    }
  }

  /* =========================================
     LOAD INITIAL SESSION
  ========================================= */

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const {
          data,
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "Get session error:",
            error
          );

          if (mounted) {
            setUser(null);
            setLoading(false);
          }

          return;
        }

        if (mounted) {
          setUser(
            data.session?.user ?? null
          );

          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Load session error:",
          error
        );

        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    }

    loadSession();

    /* =======================================
       AUTH STATE LISTENER
    ======================================= */

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!mounted) {
            return;
          }

          setUser(
            session?.user ?? null
          );

          setLoading(false);
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================================
   USE AUTH
========================================= */

export function useAuth() {
  return useContext(AuthContext);
}