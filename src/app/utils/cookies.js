"use client";

import Cookies from "js-cookie";

export function getOrDefault(key, defaultValue) {
    const value = Cookies.get(key);
    return value !== undefined ? value : defaultValue;
}

export function setCookie(key, value) {
    Cookies.set(key, value, { expires: 365 }); // 1 año
}


export CookiesUtils={}
