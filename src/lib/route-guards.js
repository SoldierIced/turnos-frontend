// Rutas protegidas y sus requisitos.
// Si agregás una ruta nueva, solo la sumás acá y en MATCHERS.
export const ROUTE_GUARDS = [
    // Solo usuarios logueados
    { pattern: /^\/panel(\/|$)/, requireAuth: true },

    // Solo admins (también requiere estar logueado)
    { pattern: /^\/admin(\/|$)/, requireAuth: true, roles: ["admin"] },
];

// Para Next config.matcher (debe ser estático)
export const MATCHERS = [
    "/panel/:path*",  // logged-in
    "/admin/:path*",  // admin
];
