"use client";

import { NavActions } from "@/components/nav-actions";
import { Separator } from "@/components/ui/separator";
import { NotebookText } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useContext(AuthContext);
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <NotebookText />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {!loading && (
            <div className="line-clamp-1">
              Bem vindo, {user ? user.username : ""}
            </div>
          )}
        </div>
        <div className="ml-auto px-3">
          <NavActions />
        </div>
      </header>
      <div className="h-[calc(100vh-56px)]">{children}</div>
    </>
  );
}
