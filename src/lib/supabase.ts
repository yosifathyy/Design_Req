import { createClient } from "@supabase/supabase-js";
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
    supabaseUrl.startsWith("https://"),
);

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase not configured. Running in development mode with mock data.",
  );
  console.warn("To enable real data, create a .env file with:");
  console.warn("VITE_SUPABASE_URL=your-supabase-project-url");
  console.warn("VITE_SUPABASE_ANON_KEY=your-supabase-anon-key");
}

// Create Supabase client with fallback values for development
export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
    },
    global: {
      headers: isSupabaseConfigured ? {} : { "X-Development-Mode": "true" },
    },
  },
);
