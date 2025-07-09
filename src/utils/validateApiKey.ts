// Validate if the Supabase API key looks complete and valid
export const validateApiKey = (key: string) => {
  console.log("🔍 Validating API Key...");
  
  if (!key) {
    return {
      valid: false,
      issue: "API key is missing or undefined",
      recommendation: "Please provide a valid Supabase API key",
    };
  }
  
  console.log("Key length:", key.length);
  console.log("Key preview:", key.substring(0, 50) + "...");

  // A typical Supabase JWT has 3 parts separated by dots
  const parts = key.split(".");
  console.log("JWT parts count:", parts.length);

  if (parts.length !== 3) {
    return {
      valid: false,
      issue: `JWT should have 3 parts (header.payload.signature), found ${parts.length}`,
      recommendation: "Check if the API key was copied completely",
    };
  }

  // Check each part length
  console.log("Header length:", parts[0].length);
  console.log("Payload length:", parts[1].length);
  console.log("Signature length:", parts[2].length);

  // Typical Supabase anon keys are much longer
  if (key.length < 200) {
    return {
      valid: false,
      issue: `API key seems too short (${key.length} chars). Typical Supabase keys are 300+ characters`,
      recommendation:
        "Verify the complete API key was copied from Supabase dashboard",
    };
  }

  // Check signature part exists and has reasonable length
  if (parts[2].length < 20) {
    return {
      valid: false,
      issue: `Signature part too short (${parts[2].length} chars)`,
      recommendation:
        "The API key appears to be truncated. Get the complete key from Supabase dashboard",
    };
  }

  return {
    valid: true,
    message: "API key format looks valid",
  };
};
