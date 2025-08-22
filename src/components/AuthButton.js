"use client";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuth } from "@/components/hooks/useAuth";

export default function AuthButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const { user, logout } = useAuth();

    // 🔹 Clase base para los botones
    const baseBtn =
        "px-4 py-2 rounded-lg font-medium transition " +
        "bg-army text-white " +
        "hover:bg-army-700 focus:ring-2 focus:ring-army-500 focus:outline-none " +
        "active:scale-95";

    return (
        <div className="flex gap-3">
            {!user ? (
                <>
                    {/* Botón de Login */}
                    <button
                        onClick={() => {
                            setIsLogin(true);
                            setIsOpen(true);
                        }}
                        className={baseBtn}
                    >
                        Iniciar Sesión
                    </button>

                    {/* Botón de Registro */}
                    <button
                        onClick={() => {
                            setIsLogin(false);
                            setIsOpen(true);
                        }}
                        className={baseBtn}
                    >
                        Registrarse
                    </button>

                    {/* Modal */}
                    <AuthModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        isLogin={isLogin}
                    />
                </>
            ) : (
                <button
                    onClick={logout}
                    className={baseBtn}
                >
                    Cerrar Sesión
                </button>
            )}
        </div>
    );
}
