"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "login";

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>

        {/* Tabs de login/register */}
        <div className="flex justify-center gap-2">
          <Button
            variant={tab === "login" ? "default" : "outline"}
            asChild
            size="sm"
          >
            <Link href="/auth?tab=login">Entrar</Link>
          </Button>
          <Button
            variant={tab === "register" ? "default" : "outline"}
            asChild
            size="sm"
          >
            <Link href="/auth?tab=register">Cadastrar</Link>
          </Button>
        </div>

        {/* Formulário dinâmico */}
        {tab === "register" ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
}
