"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash } from "lucide-react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(!slug || slug !== "new");

  const isNew = slug === "new";

  useEffect(() => {
    if (!isNew) {
      api
        .get(`/readmes/${slug}`)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setLoading(false);
        })
        .catch((err) => {
          toast.error("Erro ao carregar o README", {
            description: err.response?.data || "Erro desconhecido",
          });

          setLoading(false);
          console.log(err);
        });
    } else {
      setLoading(false);
    }
  }, [slug, isNew]);

  const save = async () => {
    if (!title || !content) {
      toast.error("Preencha todos os campos");
      return;
    }

    toast.loading("Salvando...");

    let res;
    if (isNew) {
      res = await api.post("/readmes", { title, content });
    } else {
      res = await api.put(`/readmes/${slug}`, { title, content });
      setLoading(false);
    }
    toast.dismiss();
    if (res && (res.status === 201 || res.status === 200)) {
      if (isNew) {
        toast.success("Salvo com sucesso!");
      } else {
        toast.success("Atualizado com sucesso!");
      }
      router.push("/readmes");
    } else {
      toast.error("Erro", {
        description: res?.data?.message || "Erro desconhecido",
      });
    }
  };

  const remove = async () => {
    toast.loading("Excluindo...");
    const res = await api.delete(`/readmes/${slug}`);
    toast.dismiss();
    if (res && res.status === 200) {
      toast.success("Excluido com sucesso!");
      router.push("/readmes");
    } else {
      toast.error("Erro", {
        description: res?.data?.message || "Erro desconhecido",
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex gap-2 items-center mb-4">
        {loading ? (
          <Skeleton className="w-1/4 h-10 rounded-md" />
        ) : (
          <Input
            className="w-1/4"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
        <Button onClick={save} disabled={loading} type="button">
          <Save className="mr-2" />
          Salvar
        </Button>
        {!isNew && (
          <Button
            variant="destructive"
            onClick={remove}
            disabled={true}
            type="button"
          >
            <Trash className="mr-2" />
            Excluir
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => router.push("/readmes")}
          disabled={loading}
          type="button"
        >
          <ArrowLeft className="mr-2" />
          Voltar
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 mb-8 min-h-0">
        {loading ? (
          <>
            <Skeleton className="h-full w-full rounded-md" />
            <Skeleton className="h-full w-full rounded-md" />
          </>
        ) : (
          <>
            <textarea
              className="w-full h-full p-2 border rounded-md resize-none overflow-auto"
              placeholder="Conteúdo Markdown"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="prose dark:prose-invert max-w-none rounded-md border overflow-auto">
              <MarkdownPreview source={content} style={{ padding: 16 }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
