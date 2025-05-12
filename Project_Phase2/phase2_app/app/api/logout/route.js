// app/api/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  // Overwrite the auth-token cookie with empty value and immediate expiration
  response.cookies.set("auth-token", "", { maxAge: 0, path: "/" });
  return response;
}
