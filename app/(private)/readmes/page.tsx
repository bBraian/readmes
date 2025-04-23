"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/axios";
import { AuthContext } from "@/app/context/AuthContext";

interface Readme {
  id: number;
  title: string;
  content: string;
}

export default function Page() {
  const [readmes, setReadmes] = useState<Readme[] | null>(null);
  const { loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      api
        .get("/readmes")
        .then((res) => {
          setReadmes(res.data);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loading]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button asChild>
          <Link href="/readmes/new">
            <Plus className="mr-2" />
            Novo README
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {readmes
          ? readmes.map((readme) => (
              <Card key={readme.id}>
                <CardHeader>
                  <CardTitle>{readme.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {readme.content}
                  </p>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/readmes/${readme.id}`}>Ver</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-8 w-20 mt-4" />
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
