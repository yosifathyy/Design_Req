import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Loader2, User, CheckCircle, AlertTriangle } from "lucide-react";

export const UserIDMismatchFixer: React.FC = () => {
  const { user } = useAuth();
  const [fixing, setFixing] = useState(false);
  const [result, setResult] = useState<string>("");

  const fixUserIDMismatch = async () => {
    if (!user) {
      setResult("❌ No user logged in");
      return;
    }

    setFixing(true);
    setResult("Checking for user ID mismatch...");

    try {
      // Check if user exists by ID
      const { data: userById, error: byIdError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userById && !byIdError) {
        setResult("✅ User ID matches - no mismatch detected");
        setFixing(false);
        return;
      }

      // Check if user exists by email
      const { data: userByEmail, error: byEmailError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

      if (userByEmail && !byEmailError) {
        setResult(
          `Found user with email but different ID. Database ID: ${userByEmail.id}, Auth ID: ${user.id}. Fixing...`,
        );

        // Delete the old record
        const { error: deleteError } = await supabase
          .from("users")
          .delete()
          .eq("email", user.email);

        if (deleteError) {
          setResult(`❌ Failed to delete old record: ${deleteError.message}`);
          setFixing(false);
          return;
        }

        // Create new record with correct ID
        const userData = {
          id: user.id,
          email: user.email,
          name:
            userByEmail.name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User",
          role:
            userByEmail.role ||
            (user.email === "admin@demo.com" ? "admin" : "user"),
          status: userByEmail.status || "active",
          xp: userByEmail.xp || 0,
          level: userByEmail.level || 1,
          avatar_url:
            userByEmail.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          bio: userByEmail.bio,
          skills: userByEmail.skills,
          hourly_rate: userByEmail.hourly_rate,
          created_at: userByEmail.created_at || new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([userData])
          .select()
          .single();

        if (createError) {
          setResult(`❌ Failed to create new record: ${createError.message}`);
        } else {
          setResult(
            "✅ User ID mismatch fixed! User record recreated with correct ID. Refreshing page...",
          );
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        setResult(
          "❌ No user found by email either - this is a different issue",
        );
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setFixing(false);
    }
  };

  if (!user) {
    return (
      <Card className="border-2 border-yellow-500 bg-yellow-50 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">
            Please log in to check for user ID mismatch
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-500 bg-blue-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-800">
          🔧 User ID Mismatch Fixer
        </h3>
        <Button
          onClick={fixUserIDMismatch}
          disabled={fixing}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {fixing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <User className="w-4 h-4 mr-1" />
          )}
          {fixing ? "Fixing..." : "Fix ID Mismatch"}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
          <div className="font-medium text-blue-800">Current Auth User:</div>
          <div className="text-blue-700 font-mono text-xs">
            ID: {user.id}
            <br />
            Email: {user.email}
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
          <strong>Purpose:</strong> Fixes the case where a user exists in the
          database with the same email but different ID than the authenticated
          user, causing foreign key errors in messages.
        </div>
      </div>
    </Card>
  );
};

export default UserIDMismatchFixer;
