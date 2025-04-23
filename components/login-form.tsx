import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useContext, useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoading(true);
    toast.loading("Fazendo login...");

    try {
      const { data } = await api.post("/auth/login", { username, password });
      if (data.token) {
        signIn(data.token)
          .then(() => {
            toast.dismiss();
            toast.success("Login realizado com sucesso");
            router.push("/readmes");
          })
          .catch((e: string) => {
            toast.dismiss();
            toast.error("Erro ao fazer login");
            console.error(e);
          });
      }
    } catch (err: unknown) {
      toast.dismiss();
      console.error(err);

      let errorMessage = "Erro desconhecido";

      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error("Falha no login", {
        position: "top-center",
        description: errorMessage,
      });
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="username"
                    placeholder=""
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
