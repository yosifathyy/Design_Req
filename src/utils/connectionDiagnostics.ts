import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface ConnectionDiagnostics {
  timestamp: string;
  configured: boolean;
  urlValid: boolean;
  keyValid: boolean;
  networkOnline: boolean;
  directApiAccess: boolean;
  supabaseClientAccess: boolean;
  authEndpoint: boolean;
  usersTable: boolean;
  chatsTable: boolean;
  messagesTable: boolean;
  error?: string;
  details: string[];
}

export const runConnectionDiagnostics =
  async (): Promise<ConnectionDiagnostics> => {
    const diagnostics: ConnectionDiagnostics = {
      timestamp: new Date().toISOString(),
      configured: false,
      urlValid: false,
      keyValid: false,
      networkOnline: navigator.onLine,
      directApiAccess: false,
      supabaseClientAccess: false,
      authEndpoint: false,
      usersTable: false,
      chatsTable: false,
      messagesTable: false,
      details: [],
    };

    try {
      // Test 1: Configuration check
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      diagnostics.configured = isSupabaseConfigured;
      diagnostics.urlValid = Boolean(
        url && url.startsWith("https://") && url.includes(".supabase.co"),
      );
      diagnostics.keyValid = Boolean(
        key && key.startsWith("eyJ") && key.length > 100,
      );

      if (!diagnostics.configured) {
        diagnostics.error = "Supabase not properly configured";
        diagnostics.details.push(`URL valid: ${diagnostics.urlValid}`);
        diagnostics.details.push(`Key valid: ${diagnostics.keyValid}`);
        return diagnostics;
      }

      diagnostics.details.push("✅ Configuration check passed");

      // Test 2: Direct API access
      try {
        const directResponse = await fetch(`${url}/rest/v1/`, {
          method: "GET",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });

        diagnostics.directApiAccess = directResponse.ok;
        if (directResponse.ok) {
          diagnostics.details.push("✅ Direct API access successful");
        } else {
          const errorText = await directResponse.text();
          diagnostics.details.push(
            `❌ Direct API failed: ${directResponse.status} - ${errorText}`,
          );
        }
      } catch (error: any) {
        diagnostics.details.push(`❌ Direct API error: ${error.message}`);
      }

      // Test 3: Auth endpoint
      try {
        const authResponse = await fetch(`${url}/auth/v1/user`, {
          method: "GET",
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });

        diagnostics.authEndpoint =
          authResponse.status === 401 || authResponse.status === 200; // 401 is expected for unauthorized
        if (diagnostics.authEndpoint) {
          diagnostics.details.push("✅ Auth endpoint accessible");
        } else {
          diagnostics.details.push(
            `❌ Auth endpoint failed: ${authResponse.status}`,
          );
        }
      } catch (error: any) {
        diagnostics.details.push(`❌ Auth endpoint error: ${error.message}`);
      }

      // Test 4: Supabase client
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id")
          .limit(1);

        diagnostics.supabaseClientAccess = !error;
        diagnostics.usersTable = !error;

        if (!error) {
          diagnostics.details.push("✅ Supabase client working");
          diagnostics.details.push("✅ Users table accessible");
        } else {
          const errorMsg =
            error?.message || error?.details || JSON.stringify(error);
          diagnostics.details.push(`❌ Supabase client failed: ${errorMsg}`);
        }
      } catch (error: any) {
        diagnostics.details.push(`❌ Supabase client error: ${error.message}`);
      }

      // Test 5: Chats table
      try {
        const { error: chatsError } = await supabase
          .from("chats")
          .select("id")
          .limit(1);
        diagnostics.chatsTable = !chatsError;

        if (!chatsError) {
          diagnostics.details.push("✅ Chats table accessible");
        } else {
          const errorMsg =
            chatsError?.message ||
            chatsError?.details ||
            JSON.stringify(chatsError);
          diagnostics.details.push(`❌ Chats table failed: ${errorMsg}`);
        }
      } catch (error: any) {
        diagnostics.details.push(`❌ Chats table error: ${error.message}`);
      }

      // Test 6: Messages table
      try {
        const { error: messagesError } = await supabase
          .from("messages")
          .select("id")
          .limit(1);
        diagnostics.messagesTable = !messagesError;

        if (!messagesError) {
          diagnostics.details.push("✅ Messages table accessible");
        } else {
          const errorMsg =
            messagesError?.message ||
            messagesError?.details ||
            JSON.stringify(messagesError);
          diagnostics.details.push(`❌ Messages table failed: ${errorMsg}`);
        }
      } catch (error: any) {
        diagnostics.details.push(`❌ Messages table error: ${error.message}`);
      }
    } catch (error: any) {
      diagnostics.error = error.message || "Diagnostics failed";
      diagnostics.details.push(`❌ General error: ${error.message}`);
    }

    return diagnostics;
  };

export const printDiagnostics = (diagnostics: ConnectionDiagnostics) => {
  console.log("=== SUPABASE CONNECTION DIAGNOSTICS ===");
  console.log("Timestamp:", diagnostics.timestamp);
  console.log("Network Online:", diagnostics.networkOnline);
  console.log("Configured:", diagnostics.configured);
  console.log("URL Valid:", diagnostics.urlValid);
  console.log("Key Valid:", diagnostics.keyValid);
  console.log("Direct API:", diagnostics.directApiAccess);
  console.log("Supabase Client:", diagnostics.supabaseClientAccess);
  console.log("Auth Endpoint:", diagnostics.authEndpoint);
  console.log("Users Table:", diagnostics.usersTable);
  console.log("Chats Table:", diagnostics.chatsTable);
  console.log("Messages Table:", diagnostics.messagesTable);

  if (diagnostics.error) {
    console.log("Error:", diagnostics.error);
  }

  console.log("Details:");
  diagnostics.details.forEach((detail) => console.log(" ", detail));
  console.log("==========================================");
};
