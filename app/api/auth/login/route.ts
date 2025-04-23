
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { message: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      ); 
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET);

    const response = NextResponse.json(
      { message: "Autenticado com sucesso", token },
      { status: 200 },
    );

    return response

  } catch (error) {
    console.error("Error updating script:", error);
    return NextResponse.json({ error: "Internal server error"}, { status: 500 });
  }
}
