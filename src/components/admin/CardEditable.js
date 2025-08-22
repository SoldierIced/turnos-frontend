"use client";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

export default function CardEditable({ title, value, changeValue, subtitle, type = "number" }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value)
    },[value]);
    const handleBlur = () => {
        setIsEditing(false);
        if (type === "number") {
            if (!isNaN(tempValue)) {
                changeValue(Number(tempValue));
            }
        } else {
            changeValue(tempValue); // fecha u otro tipo
        }
    };

    const renderDisplayValue = () => {
        if (type === "number") {
            return value.toLocaleString("es-AR");
        }
        return value; // fecha o string
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-800 text-xl font-bold">{title}</p>
            {isEditing ? (
                <input
                    type={type}
                    autoFocus
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => e.key === "Enter" && handleBlur()}
                    className="text-2xl font-bold text-army text-center w-full border rounded"
                />
            ) : (
                <div
                    className="flex items-center justify-center gap-2 cursor-pointer group"
                    onClick={() => setIsEditing(true)}
                >
                    <p className="text-2xl font-bold text-army" >{renderDisplayValue()}</p>
                    <Pencil
                        size={18}
                        className="text-gray-400 group-hover:text-indigo-500 transition"
                    />
                </div>
            )}

            {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
    );
}
