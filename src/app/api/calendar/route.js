import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization"); // Obtener el token del request
    if (!authHeader) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const response = await fetch("http://localhost:4000/calendar/events", {
      method: "GET",
      headers: {
        Authorization: authHeader, // Pasar el token al backend
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
