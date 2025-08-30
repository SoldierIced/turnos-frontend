// app/api/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const c = await cookies();
  // Borra cookies que usás para auth
  c.delete("access_token");
  c.delete("user");

  // Si antes usabas otros nombres (token, userData), borralos también:
  c.delete("token");
  c.delete("userData");

  return NextResponse.json({ ok: true });
}
