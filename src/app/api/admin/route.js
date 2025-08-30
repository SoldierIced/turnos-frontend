import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
    try {
        const cookieToken =( await cookies()).get("access_token")?.value;
        if (!cookieToken) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const response = await fetch("http://localhost:4000/calendar/admin/events", {
            method: "GET",
            headers: {
                Authorization: 'Bearer '+cookieToken,
                "Content-Type": "application/json",
            },
        });

        const contentType = response.headers.get("content-type") || "";
        const raw = await response.text();
        let body = raw;
        if (contentType.includes("application/json") && raw) {
            try { body = JSON.parse(raw); } catch {}
        }

        return NextResponse.json(body, { status: response.status });
    } catch (e) {
        return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
    }
}
