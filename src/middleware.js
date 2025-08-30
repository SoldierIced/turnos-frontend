import { NextResponse } from "next/server";
import { ROUTE_GUARDS, MATCHERS } from "./lib/route-guards";

function redirectTo(req, pathname) {
    const url = req.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url);
}

function redirectToLogin(req) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
}

function parseUserCookie(req) {
    const raw = req.cookies.get("user")?.value;
    if (!raw) return null;
    try {
        // si guardaste JSON plano funciona directo;
        // si lo guardaste encodeURI(JSON), esto también lo soporta:
        const decoded = decodeURIComponent(raw);
        return JSON.parse(decoded);
    } catch {
        try { return JSON.parse(raw); } catch { return null; }
    }
}

function hasRole(user, roles) {
    if (!roles?.length) return true;
    const isAdmin =
        user?.role === "admin" ||
        user?.isAdmin === true ||
        (Array.isArray(user?.roles) && user.roles.includes("admin"));
    if (roles.includes("admin")) return !!isAdmin;
    // si definís más roles, extendé esta lógica
    return false;
}

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // Encontrar la regla que aplica a la ruta actual
    const rule = ROUTE_GUARDS.find(r => r.pattern.test(pathname));

    if (!rule) return NextResponse.next(); // ruta pública

    const token = req.cookies.get("access_token")?.value || null;
    const user = parseUserCookie(req);
    console.log('user',token,rule.requireAuth,user,"DDDDDDDDDDDDDDDDDDDDDDDD")

    // 1) Requiere login
    if (rule.requireAuth && !token) {
        return redirectToLogin(req);
    }

    // 2) Requiere rol
    if (user?.isAdmin !==true) {
        return redirectTo(req, "/"); // o donde quieras
    }

    // OK
    return NextResponse.next();
}

// Importante: Next exige matchers estáticos
export const config = {
    matcher: MATCHERS,
};
