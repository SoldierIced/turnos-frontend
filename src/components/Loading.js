"use client";
import React from "react";

export default function Loading({ show }) {
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center bg-gray-50 z-50 
      transition-opacity duration-700  ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
            <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 text-army"></div>
                <span className="text-xl font-semibold text-army">Cargando...</span>
            </div>
        </div>
    );
}
