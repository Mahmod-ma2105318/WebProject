// app/api/login/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";  // if using Prisma for user DB

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;  // secret key for signing JWT

export async function POST(request) {
  const { username, password } = await request.json();

  // 1. Validate the username/password against the database
  const user = await prisma.user.findUnique({ where: { username } });
  // (In practice, compare hashed passwords. For simplicity, assume plain text comparison here)
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // 2. User is valid – create a JWT token with user info and expiration
  const token = jwt.sign(
    { sub: user.id, name: user.username, role: user.role },     // payload: user ID, name, role, etc.
    JWT_SECRET, 
    { expiresIn: "1h" }    // token valid for 1 hour
  );

  // 3. Set the JWT in an HttpOnly cookie so it's sent in subsequent requests
  const response = NextResponse.json({ message: "Login successful" });
  response.cookies.set("auth-token", token, {
    httpOnly: true,   // JS cannot read this cookie (mitigates XSS)
    secure: true,     // cookie sent only over HTTPS (set to true in production)
    sameSite: "Strict",
    path: "/",        // cookie is valid for all routes
    maxAge: 60 * 60   // 1 hour in seconds
  });
  return response;
}
