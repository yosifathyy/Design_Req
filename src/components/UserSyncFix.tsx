import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, User, CheckCircle, AlertTriangle } from "lucide-react";

export const UserSyncFix: React.FC = () => {
  const { user, profile } = useAuth();
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<string>("");

  const fixUserRecord = async () => {
    if (!user) {
      setResult("❌ No user logged in");
      return;
    }

    setFixing(true);
    setResult("Checking user record...");

    try {
      // First check if user exists by ID
      const { data: existingUserById, error: checkByIdError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existingUserById && !checkByIdError) {
        setResult("✅ User record already exists in database with correct ID");
        setFixing(false);
        return;
      }

      // Check if user exists by email (different ID)
      const { data: existingUserByEmail, error: checkByEmailError } =
        await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();

      if (existingUserByEmail && !checkByEmailError) {
        // User exists with email but different ID - update the ID
        setResult("Found existing user with different ID, updating...");

        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({
            id: user.id,
            last_login: new Date().toISOString(),
          })
          .eq("email", user.email)
          .select()
          .single();

        if (updateError) {
          // If update fails, try deleting old record and creating new one
          setResult("Updating failed, recreating user record...");

          const { error: deleteError } = await supabase
            .from("users")
            .delete()
            .eq("email", user.email);

          if (deleteError) {
            throw new Error(
              `Could not remove old user record: ${deleteError.message}`,
            );
          }

          // Now create new record
          await createNewUserRecord();
        } else {
          setResult(
            "✅ User ID updated successfully! You can now send messages.",
          );
          // Refresh the page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        return;
      }

      // User doesn't exist at all, create new record
      await createNewUserRecord();
    } catch (error: any) {
      console.error("Failed to fix user record:", error);
      setResult(`❌ Failed to fix user record: ${error.message}`);
    } finally {
      setFixing(false);
    }
  };

  const createNewUserRecord = async () => {
    setResult("Creating new user record...");

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

    console.log("Creating user record:", userData);

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (createError) {
      // Log detailed error information
      const errorDetails = {
        message: createError.message,
        details: createError.details,
        hint: createError.hint,
        code: createError.code,
      };
      console.error("User creation failed:", errorDetails);
      console.error(
        "Full create error:",
        JSON.stringify(createError, Object.getOwnPropertyNames(createError), 2),
      );

      // Check for RLS permission issues
      if (
        createError.code === "42501" ||
        createError.message?.includes("permission denied") ||
        createError.message?.includes("RLS")
      ) {
        throw new Error(
          `Permission denied: Row Level Security policies are preventing user creation. Please contact admin to disable RLS on users table or create proper insert policies. Error: ${createError.message}`,
        );
      }

      // Check for duplicate user
      if (
        createError.code === "23505" ||
        createError.message?.includes("duplicate")
      ) {
        throw new Error(
          `User record may already exist with this ID or email. Try refreshing the page. Error: ${createError.message}`,
        );
      }

      throw createError;
    }

    setResult(
      `✅ User record created successfully! You can now send messages.`,
    );

    // Refresh the page after a short delay to update the profile
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const checkUserStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        setResult(`❌ User record missing: ${error.message}`);
      } else {
        setResult(`✅ User record exists: ${data.email}`);
      }
    } catch (err: any) {
      setResult(`❌ Check failed: ${err.message}`);
    }
  };

  React.useEffect(() => {
    if (user) {
      checkUserStatus();
    }
  }, [user]);

  // Auto-fix capability - can be triggered by parent components
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("autofix") === "user" && user && !profile) {
      // Automatically attempt to fix user record if autofix parameter is present
      setTimeout(() => fixUserRecord(), 1000);
    }
  }, [user, profile]);

  if (!user) {
    return (
      <Card className="border-2 border-yellow-500 bg-yellow-50 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">
            Please log in to check user record
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-500 bg-blue-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-800">👤 User Record Fix</h3>
        <Button
          onClick={fixUserRecord}
          disabled={fixing}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {fixing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <User className="w-4 h-4 mr-1" />
          )}
          {fixing ? "Fixing..." : "Fix User Record"}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
          <div className="font-medium text-blue-800">Current User:</div>
          <div className="text-blue-700">
            Email: {user.email}
            <br />
            Auth ID: {user.id}
            <br />
            Profile Exists: {profile ? "✅ Yes" : "❌ No"}
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

        <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
          <strong>Issue:</strong> Your auth account exists but there's no
          matching record in the users table. This prevents message sending due
          to foreign key constraints.
        </div>
      </div>
    </Card>
  );
};

export default UserSyncFix;
