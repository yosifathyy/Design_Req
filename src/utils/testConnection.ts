import { validateApiKey } from "./validateApiKey";

// Simple direct test to debug Supabase connection issues
export const testSupabaseDirectly = async () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("🔍 Testing Supabase Connection Directly...");
  console.log("URL:", url);
  console.log("Key (first 30 chars):", key?.substring(0, 30) + "...");
  console.log("Key length:", key?.length);

  // Validate API key first
  const keyValidation = validateApiKey(key);
  console.log("API Key validation:", keyValidation);

  if (!keyValidation.valid) {
    return {
      success: false,
      error: `Invalid API key: ${keyValidation.issue}`,
      recommendation: keyValidation.recommendation,
    };
  }

  // Test 1: Basic health check
  try {
    console.log("Test 1: Health check...");
    const response = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    console.log("Health check status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Health check failed:", errorText);
      return {
        success: false,
        error: `Health check failed: ${response.status} ${errorText}`,
      };
    }

    console.log("✅ Health check passed");
  } catch (error: any) {
    console.error("❌ Health check error:", error.message);
    return { success: false, error: `Network error: ${error.message}` };
  }

  // Test 2: Try to access users table
  try {
    console.log("Test 2: Users table access...");
    const response = await fetch(`${url}/rest/v1/users?select=id&limit=1`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
    });

    console.log("Users table status:", response.status);

    if (response.status === 200) {
      const data = await response.json();
      console.log("✅ Users table accessible, found", data.length, "records");
      return { success: true, message: "Connection successful" };
    } else if (response.status === 401) {
      console.error("❌ Authentication failed - check API key");
      return {
        success: false,
        error: "Authentication failed - invalid API key",
      };
    } else if (response.status === 404) {
      console.error("❌ Users table not found");
      return { success: false, error: "Users table does not exist" };
    } else {
      const errorText = await response.text();
      console.error("❌ Users table error:", response.status, errorText);
      return {
        success: false,
        error: `API error: ${response.status} ${errorText}`,
      };
    }
  } catch (error: any) {
    console.error("❌ Users table test error:", error.message);
    return { success: false, error: `Network error: ${error.message}` };
  }
};
