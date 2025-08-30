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

    return (await res.json()).data;
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

export async function saveCookie(name, data, opts = {}) {
    const cookieStore = await cookies();                // ✅ sin await
    const value = typeof data === "object" ? JSON.stringify(data) : String(data);
     cookieStore.set(name, value, {
        path: "/",
        sameSite: "lax",                           // 'strict' puede romper redirecciones
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,                  // 7 días
        httpOnly: true,                            // por defecto HttpOnly
        ...opts,
    });
}

export async function deleteCookie(name) {
    cookies().delete(name);
}
export async function getCookieServer(name) {
    const cookieStore = await cookies();
    let cookieString = cookieStore.get(name);
    return (JSON.parse(cookieString) == undefined) ? cookieString : JSON.parse(cookieString);
}
