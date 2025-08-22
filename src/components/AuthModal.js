"use client";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";

export default function AuthModal({ isOpen, onClose, isLogin = true }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const { login,user } = useAuth();
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
      console.log(response);
      if (!res.ok) {
        throw new Error("Error en la autenticación");
      }
      login(response.user, response.access_token);
      window.location.replace("/admin");
    } catch (err) {
        console.log(err);
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <>
              <input type="text" placeholder="Nombre" className="p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="text" placeholder="Teléfono" className="p-2 border rounded" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </>
          )}
          <input type="email" placeholder="Correo" className="p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" className="p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700">Cerrar</button>
      </div>
    </div>
  );
}
