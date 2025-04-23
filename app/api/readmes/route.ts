import { PrismaClient } from "@prisma/client";
import { getUserFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  console.log("GET /api/readmes");
  const userId = getUserFromRequest(request);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const readmes = await prisma.readme.findMany({
    where: { userId },
  });

  return Response.json(readmes);
}

export async function POST(request: Request) {
  const userId = getUserFromRequest(request);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { title, content } = await request.json();

  const newReadme = await prisma.readme.create({
    data: { title, content, userId },
  });

  return new Response(JSON.stringify(newReadme), { status: 201 });
}
