import { getUserFromRequest } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = getUserFromRequest(req); // Aqui pega o userId da request
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const readme = await prisma.readme.findUnique({
    where: { id: params.id, userId },
  });

  if (!readme) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  return Response.json(readme);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = getUserFromRequest(req); // Aqui pega o userId da request
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const readme = await prisma.readme.findUnique({
    where: { id: params.id, userId },
  });

  if (!readme) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  const { title, content } = await req.json();

  const updated = await prisma.readme.update({
    where: { id: params.id },
    data: { title, content },
  });

  return Response.json(updated);
}
