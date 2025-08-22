import { NextResponse } from "next/server";

export async function GET(req) {
    console.log('1');
  try {
    const authHeader = req.headers.get("authorization"); // Obtener el token del request
    if (!authHeader) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      console.log('2');

    const response = await fetch("http://localhost:4000/calendar/get", {
      method: "GET",
      headers: {
        Authorization: authHeader, // Pasar el token al backend
        "Content-Type": "application/json",
      },
    });
      console.log('3');

    const data = await response.json();
    console.log(data)
    return NextResponse.json(data);
  } catch (error) {
      console.log('4');

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
