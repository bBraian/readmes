import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const readmes = await prisma.readme.findMany();
    return res.json(readmes);
  }

  if (req.method === "POST") {
    const { title, content } = req.body;
    const newReadme = await prisma.readme.create({ data: { title, content } });
    return res.status(201).json(newReadme);
  }

  res.status(405).end();
}
