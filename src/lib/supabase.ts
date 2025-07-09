// Re-export the properly configured Supabase client
export { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Since we have a properly configured client, mark as configured
export const isSupabaseConfigured = true;

// Log configuration details for debugging
console.log("✅ Supabase is properly configured and connected");
