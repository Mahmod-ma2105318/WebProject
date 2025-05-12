import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // top of file

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  const { username, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { sub: user.id, name: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  let redirectUrl = "/";
  switch (user.role) {
    case "STUDENT":
      redirectUrl = "/student";
      break;
    case "ADMINISTRATOR":
      redirectUrl = "/Admin";
      break;
    case "INSTRUCTOR":
      redirectUrl = "/Instructor";
      break;
    default:
      return NextResponse.json({ error: "Unknown role" }, { status: 400 });
  }

  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
