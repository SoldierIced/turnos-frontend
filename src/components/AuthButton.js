"use client";
import {useEffect, useState} from "react";
import AuthModal from "./AuthModal";
import {useAuth} from "@/components/hooks/useAuth";

export default function AuthButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const {user, logout} = useAuth();

    return (
        (!user) ?
            <div>
                {/* Botón de Login */}
                <button
                    onClick={() => {
                        setIsLogin(true);
                        setIsOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Iniciar Sesión
                </button>

                {/* Botón de Registro */
                }
                <button
                    onClick={() => {
                        setIsLogin(false);
                        setIsOpen(true);
                    }}
                    className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Registrarse
                </button>

                {/* Modal de Autenticación */
                }
                <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} isLogin={isLogin}/>
            </div> : <div>
                <button
                    onClick={() => {
                        logout();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Cerrar Sesión
                </button>
            </div>
    )
        ;
}
