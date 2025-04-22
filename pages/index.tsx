import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [readmes, setReadmes] = useState([]);

  useEffect(() => {
    fetch("/api/readmes")
      .then((res) => res.json())
      .then(setReadmes);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-black">📘 READMEs</h1>

      <Link href="/edit/new" className="text-blue-500" passHref>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          + Criar novo
        </button>
      </Link>

      <ul className="mt-4 space-y-2">
        {readmes.map((r: any) => (
          <li key={r.id}>
            <Link
              href={`/edit/${r.id}`}
              className="text-lg text-blue-600 hover:underline"
            >
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
