// Validate Supabase credentials and test connection
export const validateSupabaseCredentials = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("=== Supabase Credential Validation ===");
  console.log("URL:", url);
  console.log("Key (first 20 chars):", key?.substring(0, 20) + "...");
  console.log("Key length:", key?.length);

  const issues: string[] = [];

  // Check URL format
  if (!url) {
    issues.push("VITE_SUPABASE_URL is missing");
  } else if (!url.startsWith("https://")) {
    issues.push("URL must start with https://");
  } else if (!url.includes(".supabase.co")) {
    issues.push("URL doesn't look like a valid Supabase URL");
  }

  // Check API key format
  if (!key) {
    issues.push("VITE_SUPABASE_ANON_KEY is missing");
  } else if (!key.startsWith("eyJ")) {
    issues.push("API key doesn't look like a valid JWT token");
  } else if (key.length < 100) {
    issues.push("API key seems too short");
  }

  return {
    valid: issues.length === 0,
    issues,
    url,
    keyLength: key?.length || 0,
  };
};

// Test direct API access without Supabase client
export const testDirectApiAccess = async () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("=== Direct API Test ===");

  try {
    // Test basic API endpoint
    const response = await fetch(`${url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        message: "Direct API access successful",
      };
    } else {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return {
        success: false,
        status: response.status,
        message: `API returned ${response.status}: ${errorText}`,
      };
    }
  } catch (error: any) {
    console.error("Direct API test failed:", error);
    return {
      success: false,
      status: 0,
      message: `Network error: ${error.message}`,
    };
  }
};

// Test users table specifically
export const testUsersTableAccess = async () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("=== Users Table Test ===");

  try {
    const response = await fetch(`${url}/rest/v1/users?select=id&limit=1`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Users table response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Users table data:", data);
      return {
        success: true,
        status: response.status,
        message: "Users table accessible",
        hasData: Array.isArray(data) && data.length > 0,
      };
    } else {
      const errorText = await response.text();
      console.error("Users table error:", errorText);
      return {
        success: false,
        status: response.status,
        message: `Users table error ${response.status}: ${errorText}`,
      };
    }
  } catch (error: any) {
    console.error("Users table test failed:", error);
    return {
      success: false,
      status: 0,
      message: `Network error accessing users: ${error.message}`,
    };
  }
};
