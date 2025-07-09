import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "your-supabase-url" &&
    supabaseAnonKey !== "your-supabase-anon-key" &&
    !supabaseUrl.includes("placeholder") &&
    supabaseUrl.startsWith("https://") &&
    supabaseUrl.includes(".supabase.co"),
);

// Log configuration details for debugging
console.log("Supabase Configuration Check:");
console.log("URL:", supabaseUrl);
console.log("Key length:", supabaseAnonKey?.length || 0);
console.log("Is configured:", isSupabaseConfigured);

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase not configured. Running in development mode with mock data.",
  );
  console.warn("To enable real data, create a .env file with:");
  console.warn("VITE_SUPABASE_URL=your-supabase-project-url");
  console.warn("VITE_SUPABASE_ANON_KEY=your-supabase-anon-key");
}

// Create a mock Supabase client for development mode
const createMockSupabaseClient = (): SupabaseClient<Database> => {
  const mockClient = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      eq: function () {
        return this;
      },
      order: function () {
        return this;
      },
      single: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () =>
        Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "/placeholder.svg" } }),
      }),
    },
    channel: () => ({
      on: function () {
        return this;
      },
      subscribe: () => "mock-subscription",
    }),
    removeChannel: () => {},
  } as any;

  return mockClient;
};

// Create Supabase client only if properly configured, otherwise use mock
export const supabase: SupabaseClient<Database> = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createMockSupabaseClient();
