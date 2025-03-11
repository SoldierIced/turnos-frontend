import { cookies } from "next/headers";

export async function POST() {
  cookies().set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expira inmediatamente
  });

  return Response.json({ message: "Sesión cerrada" }, { status: 200 });
}
