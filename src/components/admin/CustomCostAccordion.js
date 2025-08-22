"use client";
import { useState } from "react";

export default function CustomCostsAccordion({ onSave }) {
    const [open, setOpen] = useState(false);
    const [ranges, setRanges] = useState([
        { from: "", to: "", cost30: "", cost60: "" },
    ]);

    const handleChange = (i, field, value) => {
        const newRanges = [...ranges];
        newRanges[i][field] = value;
        setRanges(newRanges);
    };

    const addRange = () => {
        setRanges([...ranges, { from: "", to: "", cost30: "", cost60: "" }]);
    };

    return (
        <div className="w-full max-w-2xl mt-6 border rounded-lg shadow-sm">
            {/* Header del acordeón */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 font-medium rounded-t-lg"
            >
                <span>📊 Configuración de costos custom</span>
                <span className="text-lg">{open ? "−" : "+"}</span>
            </button>

            {/* Contenido */}
            {open && (
                <div className="p-4 space-y-4 bg-white rounded-b-lg">
                    {ranges.map((range, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center border p-3 rounded-lg"
                        >
                            <input
                                type="date"
                                value={range.from}
                                onChange={(e) => handleChange(i, "from", e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="date"
                                value={range.to}
                                onChange={(e) => handleChange(i, "to", e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="number"
                                placeholder="Costo 30"
                                value={range.cost30}
                                onChange={(e) => handleChange(i, "cost30", e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="number"
                                placeholder="Costo 60"
                                value={range.cost60}
                                onChange={(e) => handleChange(i, "cost60", e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                    ))}

                    <div className="flex gap-3">
                        <button
                            onClick={addRange}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            ➕ Agregar rango
                        </button>
                        <button
                            onClick={() => onSave(ranges)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            💾 Guardar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
