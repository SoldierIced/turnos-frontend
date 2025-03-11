import { cookies } from "next/headers";


export async function getEvents(){
    const res = await fetch("http://localhost:4000/calendar/events", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en el login");
    }

    return await res.json();
}
