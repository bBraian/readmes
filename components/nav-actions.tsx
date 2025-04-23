"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export function NavActions() {
  const { theme, setTheme } = useTheme();
  const { logout } = React.useContext(AuthContext);
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/auth");
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
