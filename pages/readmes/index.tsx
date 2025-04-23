import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockReadmes = [
  { id: 1, title: "Projeto 1", description: "README do Projeto 1" },
  { id: 2, title: "Projeto 2", description: "README do Projeto 2" },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seus READMEs</h1>
        <Button asChild>
          <Link href="/readmes/new">Novo README</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockReadmes.map((readme) => (
          <Card key={readme.id}>
            <CardHeader>
              <CardTitle>{readme.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {readme.description}
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/readmes/${readme.id}`}>Ver</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
