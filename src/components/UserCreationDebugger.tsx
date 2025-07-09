import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, User, AlertTriangle, CheckCircle } from "lucide-react";

export const UserCreationDebugger: React.FC = () => {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>("");

  const testUserCreation = async () => {
    if (!user) {
      setResult("❌ No user logged in");
      return;
    }

    setTesting(true);
    setResult("Testing user creation...");

    try {
      // First check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existingUser && !checkError) {
        setResult(`✅ User already exists: ${existingUser.email}`);
        setTesting(false);
        return;
      }

      // Attempt to create the user record
      const userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        role: user.email === "admin@demo.com" ? "admin" : "user",
        status: "active",
        xp: 0,
        level: 1,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      console.log("Attempting to create user with data:", userData);

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([userData])
        .select()
        .single();

      if (createError) {
        const errorDetails = {
          message: createError.message,
          details: createError.details,
          hint: createError.hint,
          code: createError.code,
        };
        console.error("User creation failed:", errorDetails);
        console.error(
          "Full error:",
          JSON.stringify(
            createError,
            Object.getOwnPropertyNames(createError),
            2,
          ),
        );

        setResult(
          `❌ Creation failed: ${createError.message || "Unknown error"}`,
        );

        // Check for specific error types
        if (createError.code === "42501") {
          setResult(
            `❌ Permission denied - RLS policies may be blocking user creation. Error: ${createError.message}`,
          );
        } else if (createError.code === "23505") {
          setResult(
            `❌ User already exists with this ID or email. Error: ${createError.message}`,
          );
        } else if (createError.message?.includes("permission denied")) {
          setResult(
            `❌ Permission denied - check RLS policies. Error: ${createError.message}`,
          );
        }
      } else {
        console.log("User created successfully:", newUser);
        setResult(`✅ User created successfully: ${newUser.email}`);
      }
    } catch (err: any) {
      console.error("Exception during user creation:", err);
      setResult(`❌ Exception: ${err.message || "Unknown error"}`);
    } finally {
      setTesting(false);
    }
  };

  const checkRLSPolicies = async () => {
    setTesting(true);
    setResult("Checking RLS policies...");

    try {
      // Try to read from users table
      const { data: readTest, error: readError } = await supabase
        .from("users")
        .select("count")
        .limit(1);

      if (readError) {
        setResult(`❌ Cannot read users table: ${readError.message}`);
        setTesting(false);
        return;
      }

      // Try to insert a test record to see if RLS allows it
      const testData = {
        id: "test-rls-check-id-delete-me",
        email: "test-rls@example.com",
        name: "RLS Test",
        role: "user",
        status: "active",
        xp: 0,
        level: 1,
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from("users")
        .insert([testData]);

      if (insertError) {
        if (
          insertError.code === "42501" ||
          insertError.message?.includes("permission denied")
        ) {
          setResult(
            `❌ RLS policies are blocking inserts. Error: ${insertError.message}`,
          );
        } else {
          setResult(`❌ Insert test failed: ${insertError.message}`);
        }
      } else {
        // Clean up test record
        await supabase
          .from("users")
          .delete()
          .eq("id", "test-rls-check-id-delete-me");
        setResult("✅ RLS policies allow inserts");
      }
    } catch (err: any) {
      setResult(`❌ RLS check failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const checkCurrentUser = async () => {
    if (!user) {
      setResult("❌ No user logged in");
      return;
    }

    setTesting(true);
    setResult("Checking current user status...");

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setResult(`❌ User record not found for ID: ${user.id}`);
        } else {
          setResult(`❌ Error checking user: ${error.message}`);
        }
      } else {
        setResult(`✅ User found: ${data.email} (${data.role})`);
      }
    } catch (err: any) {
      setResult(`❌ Exception: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (!user) {
    return (
      <Card className="border-2 border-yellow-500 bg-yellow-50 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">
            Please log in to debug user creation
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-red-500 bg-red-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-red-800">
          🐛 User Creation Debugger
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={checkCurrentUser}
            disabled={testing}
            size="sm"
            variant="outline"
            className="border-red-500 text-red-700 hover:bg-red-100"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <User className="w-4 h-4 mr-1" />
            )}
            Check User
          </Button>
          <Button
            onClick={testUserCreation}
            disabled={testing}
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <User className="w-4 h-4 mr-1" />
            )}
            Create User
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
          <div className="font-medium text-red-800">Auth User Info:</div>
          <div className="text-red-700 font-mono text-xs">
            ID: {user.id}
            <br />
            Email: {user.email}
            <br />
            Name: {user.user_metadata?.name || "Not set"}
          </div>
        </div>

        {result && (
          <div
            className={`p-3 rounded border-2 text-sm ${
              result.includes("✅")
                ? "bg-green-50 border-green-300 text-green-800"
                : result.includes("❌")
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-blue-50 border-blue-300 text-blue-800"
            }`}
          >
            {result}
          </div>
        )}

        <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
          <strong>Debug Info:</strong> This component tests user creation to
          identify why auto-creation is failing. Check browser console for
          detailed errors.
        </div>
      </div>
    </Card>
  );
};

export default UserCreationDebugger;
