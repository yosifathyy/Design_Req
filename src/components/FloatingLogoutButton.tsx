
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const FloatingLogoutButton: React.FC = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 rounded-full w-12 h-12 p-0"
      title="Logout"
    >
      <LogOut className="w-5 h-5" />
    </Button>
  );
};

export default FloatingLogoutButton;
