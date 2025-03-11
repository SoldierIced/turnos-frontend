import { cookies } from "next/headers";

export async function loginUser(email, password) {
    const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en el login");
    }

    return await res.json();
}

export async function registerUser(name, phone, email, password) {
    const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en el registro");
    }

    return await res.json();
}

export async function saveCookie(name, data) {

    // Guardar el token en una cookie HTTP-Only
    const cookieStore = await cookies();
    data = (typeof data === "object") ? JSON.stringify(data) : data;
    // Guardar el token en una cookie HTTP-Only
    cookieStore.set(name, data, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
    });
}

export async function getCookieServer(name) {
    const cookieStore = await cookies();
    let cookieString = cookieStore.get(name);
    return (JSON.parse(cookieString) == undefined) ? cookieString : JSON.parse(cookieString);
}
