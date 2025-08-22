"use client";
import { useState, useEffect } from "react";

export default function SelectServiceModal({ isOpen, onClose, onSave, token, selectedSlot }) {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minutes, setMinutes] = useState("00"); // Solo permite 00 o 30

  useEffect(() => {
    if (isOpen) {
      fetch("/api/services", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error("Error cargando servicios:", err));
    }

    // Si hay una fecha seleccionada en el calendario, la pre-cargamos en los inputs
    if (selectedSlot) {
      setDate(selectedSlot.start.toISOString().split("T")[0]); // Extrae YYYY-MM-DD
      setHour(selectedSlot.start.getHours().toString().padStart(2, "0")); // Extrae HH
      setMinutes(selectedSlot.start.getMinutes() >= 30 ? "30" : "00"); // Redondea a 00 o 30
    }
  }, [isOpen, selectedSlot, token]);

  if (!isOpen || !selectedSlot) return null; // No renderiza el modal si no hay fecha seleccionada

  // Guardar el turno con fecha y hora seleccionada
  const handleSave = () => {
    if (!selectedService) {
      alert("Por favor selecciona un servicio.");
      return;
    }

    const newDateTime = new Date(`${date}T${hour}:${minutes}`);

    if (newDateTime < new Date()) {
      alert("No puedes seleccionar una fecha pasada.");
      return;
    }
    onSave(services.find(x=> x.id == selectedService), newDateTime); // Enviar datos actualizados al padre
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Confirmar Turno</h2>

        {/* Fecha seleccionada */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Fecha:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Hora seleccionada */}
        <div className="mb-4 flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-semibold">Hora:</label>
            <select
              className="w-full p-2 border rounded"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            >
              {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-semibold">Minutos:</label>
            <select
              className="w-full p-2 border rounded"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            >
              <option value="00">00</option>
              <option value="30">30</option>
            </select>
          </div>
        </div>

        {/* Selección de Servicio */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Servicio:</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedService(e.target.value)}
            value={selectedService || ""}
          >
            <option value="" disabled>Seleccione un servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title} - ${service.price}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-gray-400 px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="text-army text-white px-4 py-2 rounded"
            onClick={handleSave}
            disabled={!selectedService}
          >
            Confirmar Turno
          </button>
        </div>
      </div>
    </div>
  );
}
