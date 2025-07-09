import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import {
  runConnectionDiagnostics,
  printDiagnostics,
} from "@/utils/connectionDiagnostics";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, userSession?: Session | null) => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl === "your-supabase-url" ||
      supabaseAnonKey === "your-supabase-anon-key" ||
      supabaseUrl.includes("placeholder")
    ) {
      // Don't fetch profile in mock mode, it's already set
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        const errorMessage =
          error?.message ||
          error?.details ||
          error?.hint ||
          JSON.stringify(error);

        // Check if this is a network connectivity issue
        if (
          errorMessage.includes("Failed to fetch") ||
          errorMessage.includes("Network") ||
          errorMessage.includes("TypeError: Failed to fetch")
        ) {
          console.error("Network error fetching user profile:", errorMessage);
          console.log("Running connection diagnostics due to network error...");
          runConnectionDiagnostics().then(printDiagnostics);
          setProfile(null);
          return;
        }

        // For other errors, log but don't run diagnostics
        console.error("Error fetching user profile:", errorMessage);
        setProfile(null);
        return;
      }

      if (!data) {
        console.warn(
          `No user profile found for ID: ${userId}, attempting to create one...`,
        );

        // Attempt to auto-create user record
        try {
          const currentUser = userSession?.user || session?.user;
          if (currentUser) {
            const userData = {
              id: userId,
              email: currentUser.email,
              name:
                currentUser.user_metadata?.name ||
                currentUser.email?.split("@")[0] ||
                "User",
              role: currentUser.email === "admin@demo.com" ? "admin" : "user",
              status: "active",
              xp: 0,
              level: 1,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
            };

            console.log("Auto-creating user record:", userData);

            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert([userData])
              .select()
              .single();

            if (createError) {
              console.error("Failed to auto-create user record:", createError);
              setProfile(null);
              return;
            }

            console.log("User record auto-created successfully:", newUser);
            setProfile(newUser);
            return;
          }
        } catch (autoCreateError: any) {
          console.error("Auto-create user failed:", autoCreateError);
        }

        setProfile(null);
        return;
      }

      console.log("User profile fetched successfully:", data);
      setProfile(data);
    } catch (error: any) {
      // Handle network errors specifically
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        console.error("Network connectivity error:", error.message);
        console.log(
          "Please check your internet connection and Supabase configuration",
        );
        setProfile(null);
        return;
      }

      const errorMessage =
        error?.message ||
        error?.details ||
        error?.hint ||
        (typeof error === "string"
          ? error
          : JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error("Error fetching user profile:", errorMessage);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl === "your-supabase-url" ||
      supabaseAnonKey === "your-supabase-anon-key" ||
      supabaseUrl.includes("placeholder")
    ) {
      // Mock authentication for development
      console.warn("Supabase not configured - using mock authentication");

      // Simple validation for demo
      if (email === "admin@demo.com" && password === "demo123") {
        const mockUser = {
          id: "mock-admin-user",
          email: "admin@demo.com",
          aud: "authenticated",
          role: "authenticated",
          email_confirmed_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const mockSession = {
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: "bearer",
          user: mockUser,
        };

        const mockProfile = {
          id: "mock-admin-user",
          email: "admin@demo.com",
          name: "Demo Admin",
          role: "admin",
          status: "active",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
          xp: 100,
          level: 5,
          bio: "Demo admin user for testing",
          skills: ["Admin", "Management"],
          hourly_rate: null,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        // Set mock state
        setSession(mockSession);
        setUser(mockUser);
        setProfile(mockProfile);
        setLoading(false);

        return { data: mockSession, error: null };
      } else {
        setLoading(false);
        return {
          data: null,
          error: new Error("Invalid credentials. Try admin@demo.com / demo123"),
        };
      }
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      // Handle email not confirmed error
      if (authError?.message === "Email not confirmed") {
        setLoading(false);
        return {
          data: null,
          error: new Error(
            "Please check your email and click the confirmation link before signing in.",
          ),
        };
      }

      // Special handling for demo credentials - if auth fails but user exists in users table
      if (
        authError &&
        (email === "admin@demo.com" || email === "designer@demo.com") &&
        password === "demo123"
      ) {
        console.warn(
          "Demo user auth failed, checking if user exists in database...",
        );

        try {
          // Check if user exists in users table
          const { data: userProfile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

          if (userProfile && !profileError) {
            console.warn(
              "Demo user found in database but no auth account. Please run create_demo_auth_users.sql",
            );
            setLoading(false);
            return {
              data: null,
              error: new Error(
                "Demo user exists but needs authentication setup. Please contact admin to run create_demo_auth_users.sql",
              ),
            };
          }
        } catch (err: any) {
          const errorMessage =
            err?.message ||
            err?.details ||
            err?.hint ||
            (typeof err === "string"
              ? err
              : JSON.stringify(err, Object.getOwnPropertyNames(err)));
          console.error("Error checking user profile:", errorMessage);
        }
      }

      if (authError) {
        setLoading(false);
        return { data: null, error: authError };
      }

      // Update last login timestamp
      if (data?.session?.user) {
        await supabase
          .from("users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", data.session.user.id);
      }

      setLoading(false);
      return { data: data?.session || null, error: null };
    } catch (error: any) {
      setLoading(false);
      if (error.message?.includes("Failed to fetch")) {
        return {
          data: null,
          error: new Error(
            "Unable to connect to authentication service. Please check your internet connection.",
          ),
        };
      }
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);

    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl === "your-supabase-url" ||
      supabaseAnonKey === "your-supabase-anon-key" ||
      supabaseUrl.includes("placeholder")
    ) {
      // Mock sign up for development
      console.warn("Supabase not configured - using mock sign up");

      const mockUser = {
        id: `mock-user-${Date.now()}`,
        email: email,
        aud: "authenticated",
        role: "authenticated",
        email_confirmed_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSession = {
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        user: mockUser,
      };

      const mockProfile = {
        id: mockUser.id,
        email: email,
        name: name,
        role: "user",
        status: "active",
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        xp: 0,
        level: 1,
        bio: null,
        skills: null,
        hourly_rate: null,
        created_at: new Date().toISOString(),
        last_login: null,
      };

      // Set mock state
      setSession(mockSession);
      setUser(mockUser);
      setProfile(mockProfile);
      setLoading(false);

      return { data: mockSession, error: null };
    }

    try {
      // Create auth user
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !data.user) {
        setLoading(false);
        return {
          data: null,
          error: authError || new Error("User creation failed"),
        };
      }

      // Create profile in users table
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          name,
          role: "user",
          status: "active",
          xp: 0,
          level: 1,
        },
      ]);

      if (profileError) {
        const errorMessage =
          profileError?.message ||
          profileError?.details ||
          profileError?.hint ||
          (typeof profileError === "string"
            ? profileError
            : JSON.stringify(
                profileError,
                Object.getOwnPropertyNames(profileError),
              ));
        console.error("Error creating user profile:", errorMessage);
        setLoading(false);
        return {
          data: null,
          error: new Error("Failed to create user profile. Please try again."),
        };
      }

      setLoading(false);
      return {
        data: data.session,
        error: null,
      };
    } catch (error: any) {
      setLoading(false);
      if (error.message?.includes("Failed to fetch")) {
        return {
          data: null,
          error: new Error(
            "Unable to connect to authentication service. Please check your internet connection.",
          ),
        };
      }
      return { data: null, error };
    }
  };

  const signOut = async () => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl === "your-supabase-url" ||
      supabaseAnonKey === "your-supabase-anon-key" ||
      supabaseUrl.includes("placeholder")
    ) {
      // Mock sign out
      console.warn("Supabase not configured - using mock sign out");
    } else {
      try {
        await supabase.auth.signOut();
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          error?.details ||
          error?.hint ||
          (typeof error === "string"
            ? error
            : JSON.stringify(error, Object.getOwnPropertyNames(error)));
        console.error("Error signing out:", errorMessage);
      }
    }

    setSession(null);
    setUser(null);
    setProfile(null);
    navigate("/");
  };

  const updateProfile = async (updates: any) => {
    if (!user) {
      return { data: null, error: new Error("User not authenticated") };
    }

    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl === "your-supabase-url" ||
      supabaseAnonKey === "your-supabase-anon-key" ||
      supabaseUrl.includes("placeholder")
    ) {
      // Mock profile update
      console.warn("Supabase not configured - using mock profile update");
      const updatedProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      setProfile(updatedProfile);
      return { data: updatedProfile, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (!error) {
        setProfile(data);
      }

      return { data, error };
    } catch (error: any) {
      if (error.message?.includes("Failed to fetch")) {
        return {
          data: null,
          error: new Error(
            "Unable to update profile. Please check your internet connection.",
          ),
        };
      }
      return { data: null, error };
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
