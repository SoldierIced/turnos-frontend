"use client";
import {
    PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#C2A4D8FF", "#6F2DA8"]; // azul = 30, verde = 60

export default function CantidadPieChart({ data, startDate }) {

    // Filtrar por rango de fecha
    const filteredEvents = startDate
        ? data.filter(ev => {
            const evDate = new Date(ev.start);
            const start = new Date(startDate);
            const end = new Date();
            end.setHours(23, 59, 59, 999); // hoy a las 23:59:59
            return evDate >= start && evDate <= end;
        })
        : data;

    // Calcular cantidades
    const cantidad30 = filteredEvents.filter(ev => ev.title.includes("(30")).length;
    const cantidad60 = filteredEvents.filter(ev => !ev.title.includes("(30")).length;

    const pieData = [
        { name: "Cantidad 30", value: cantidad30 },
        { name: "Cantidad 60", value: cantidad60 },
    ];

    return (
        <div className="p-4 bg-white rounded-2xl shadow-md mt-6 h-[400px] p-3">
            <h2 className="text-lg font-bold mb-4">Distribución de cantidades</h2>
            <ResponsiveContainer width="100%" height="100%"  style={{paddingBottom:"50px"}}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Cantidad"]} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
