import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const readme = await prisma.readme.findUnique({ where: { id: Number(id) } });
    if (!readme) return res.status(404).json({ error: "Not found" });
    return res.json(readme);
  }

  if (req.method === "PUT") {
    const { title, content } = req.body;
    const updated = await prisma.readme.update({
      where: { id: Number(id) },
      data: { title, content }
    });
    return res.json(updated);
  }

  res.status(405).end();
}
