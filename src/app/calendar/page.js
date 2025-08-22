"use client";
import AuthButton from "@/components/AuthButton";
import SelectServiceModal from "@/components/SelectServiceModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import { useAuth } from "@/components/hooks/useAuth";

moment.locale("es");
const localizer = momentLocalizer(moment);

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  showMore: (total) => `+ Ver más (${total})`,
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const { user, token } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState(null); // Guarda la fecha seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar eventos desde la API
  useEffect(() => {
    if (user) {
      fetch("/api/calendar", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          let data = await response.json();
          const formattedEvents = data.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }));
          setEvents(formattedEvents);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // Manejar selección de fecha en el calendario
  const selectEventDate = (slotInfo) => {
    if (slotInfo.start < new Date()) {
      alert("No puedes seleccionar fechas pasadas");
      return;
    }
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  // Guardar turno cuando el usuario selecciona un servicio
  const handleSaveEvent = (selectedService) => {
    if (!selectedSlot) return;
    console.log(selectedService)
    const newEvent = {
      title: `Turno - ${selectedService.title} - ${user.email}`,
      start: selectedSlot.start,
      end: selectedSlot.end || selectedSlot.start,serviceId: selectedService.id,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]); // Agregar al calendario

    // Guardar en la API
    fetch("/api/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => console.log("Turno guardado:", data))
      .catch((err) => console.error("Error al guardar turno:", err));

    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.js
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <AuthButton />
        </div>

        <div style={{ height: 500 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor={(event) => new Date(event.start)}
            endAccessor={(event) => new Date(event.end)}
            min={new Date()}
            selectable
            onSelectSlot={selectEventDate}
            style={{ height: "100%" }}
            messages={messages}
            views={{
              month: true,
              week: true,
              day: true,
              agenda: true,
            }}
          />
        </div>
      </main>

      {/* Modal para seleccionar servicio y confirmar fecha */}
      <SelectServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        token={token}
        selectedSlot={selectedSlot} // Pasamos la fecha seleccionada
      />
    </div>
  );
}
