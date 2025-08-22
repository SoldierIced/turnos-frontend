"use client";

import Cookies from "js-cookie";

export const Utils = {
    getOrDefault(key, defaultValue, parser = v => v) {
        const value = Cookies.get(key);
        console.log(key, value);
        if (value === undefined) return defaultValue;

        try {
            return parser(value);
        } catch {
            return defaultValue;
        }
    },

    setCookie(key, value, days = 365) {
        const strValue = typeof value === "object" ? JSON.stringify(value) : String(value);
        Cookies.set(key, strValue, {expires: days});
    },

    removeCookie(key) {
        Cookies.remove(key);
    },
    formatCurrency(value) {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0, // opcional, evita decimales
        }).format(value);
    }
};
