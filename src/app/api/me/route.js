// app/api/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function parseUser(raw) {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    try { return JSON.parse(decoded); } catch {}
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET() {
  const c = await cookies();
  const token = c.get("access_token")?.value || null;
  const rawUser = c.get("user")?.value || null;
  const user = parseUser(rawUser);
  const isAdmin = !!(
      user?.role === "admin" ||
      user?.isAdmin === true ||
      (Array.isArray(user?.roles) && user.roles.includes("admin"))
  );

  return NextResponse.json(
      {
        isAuthenticated: !!token,
        user: user ?? null,
        isAdmin,
      },
      { status: 200 }
  );
}
