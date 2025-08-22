"use client";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";

export default function AuthModal({ isOpen, onClose, isLogin = true }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`/api/auth/${isLogin ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone }),
      });

      let response = await res.json();
      response = response.data;

      if (!res.ok) throw new Error("Error en la autenticación");

      login(response.user, response.access_token);
      window.location.replace("/admin");
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Fondo con imagen */}
        <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/fondo.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
        ></div>

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Modal */}
        <div className="relative bg-white p-8 rounded-xl shadow-2xl w-96 z-10">
          <h2 className="text-2xl font-bold text-center text-army mb-4">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </h2>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {!isLogin && (
                <>
                  <input
                      type="text"
                      placeholder="Nombre"
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-army-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                  />
                  <input
                      type="text"
                      placeholder="Teléfono"
                      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-army-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                  />
                </>
            )}
            <input
                type="email"
                placeholder="Correo"
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-army-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-army-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold transition bg-army text-white hover:bg-army-700 active:scale-95"
            >
              {isLogin ? "Iniciar Sesión" : "Registrarse"}
            </button>
          </form>

          <button
              onClick={onClose}
              className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
  );
}
