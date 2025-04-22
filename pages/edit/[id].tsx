import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";

export default function EditReadme() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isNew = id === "new";

  useEffect(() => {
    if (!isNew && id) {
      fetch(`/api/readmes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
        });
    }
  }, [id]);

  const save = async () => {
    const body = JSON.stringify({ title, content });
    const headers = { "Content-Type": "application/json" };

    const res = await fetch(isNew ? "/api/readmes" : `/api/readmes/${id}`, {
      method: isNew ? "POST" : "PUT",
      body,
      headers,
    });

    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col h-screen p-8">
      <div className="flex gap-2 items-center mb-4">
        <input
          className="min-w-80 p-2 border rounded text-black"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={save}
        >
          Salvar
        </button>
        <button
          className="border text-black px-4 py-2 rounded"
          onClick={() => router.push("/")}
        >
          Voltar
        </button>
      </div>

      {/* Container flexível que ocupa o restante da tela */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <textarea
          className="w-full h-full p-2 border rounded text-black resize-none overflow-auto"
          placeholder="Conteúdo Markdown"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="prose prose-sm max-w-none border p-4 rounded overflow-auto h-full">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
