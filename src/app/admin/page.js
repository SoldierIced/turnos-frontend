"use client";
import {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {useAuth} from "@/components/hooks/useAuth";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import AuthButton from "@/components/AuthButton";
import {Utils} from "@/app/utils/utils";

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
    const {user, token} = useAuth();

    // Inputs
    const [valor30, setValor30] = useState(() => Number(Utils.getOrDefault("valor30", 20000)));
    const [valor60, setValor60] = useState(() => Number(Utils.getOrDefault("valor60", 30000)));
    const [meta, setMeta] = useState(() => Number(Utils.getOrDefault("meta", 10000000)));
    const [fechaInicio, setFechaInicio] = useState(() => Utils.getOrDefault("fechaInicio", "2025-01-01"));
    // cada vez que cambien los valores -> guardar en cookie
    useEffect(() => { Utils.setCookie("valor30", valor30); }, [valor30]);
    useEffect(() => { Utils.setCookie("valor60", valor60); }, [valor60]);
    useEffect(() => { Utils.setCookie("meta", meta); }, [meta]);
    useEffect(() => { Utils.setCookie("fechaInicio", fechaInicio); }, [fechaInicio]);
    console.log(valor30,
        valor60,
        meta,
        fechaInicio);
    // Cálculos
    const [turnosFaltantes, setTurnosFaltantes] = useState(0);
    const [sesionesMes, setSesionesMes] = useState({total: 0, t30: 0, t60: 0});
    const [recaudadoMes, setRecaudadoMes] = useState(0);
    const [recaudadoTotal, setRecaudadoTotal] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [mesActualNombre, setMesActualNombre] = useState("");

    // Cargar eventos
    useEffect(() => {
        if (user) {
            fetch("/api/admin", {
                method: "GET",
                headers: {Authorization: `Bearer ${token}`},
            })
                .then(async (res) => {
                    const data = await res.json();
                    const formatted = data.events.map((ev) => ({
                        ...ev,
                        start: new Date(ev.start),
                        end: new Date(ev.end),
                    }));
                    setEvents(formatted);
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    // Calcular métricas
    useEffect(() => {
        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const añoActual = ahora.getFullYear();
        const nombreMes = ahora.toLocaleString("es-ES", {month: "long"});
        setMesActualNombre(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));

        let totalMes = 0,
            totalGlobal = 0;
        let t30Mes = 0,
            t60Mes = 0;

        // Agrupar por mes para el gráfico
        const ingresosPorMes = {};

        events.forEach((ev) => {
            const fecha = new Date(ev.start);
            const mes = fecha.getMonth();
            const año = fecha.getFullYear();

            let tipo = "60";
            if (ev.title.includes("(30")) tipo = "30";
            else if (ev.title.includes("(60")) tipo = "60";

            const valor = tipo === "30" ? valor30 : valor60;

            // total desde fechaInicio
            if (new Date(fecha) >= new Date(fechaInicio) && fecha <= ahora) {
                totalGlobal += valor;
            }

            // mes actual
            if (mes === mesActual && año === añoActual) {
                totalMes += valor;
                if (tipo === "30") t30Mes++;
                else t60Mes++;
            }

            // gráfico
            const key = `${año}-${mes + 1}`;
            if (!ingresosPorMes[key]) ingresosPorMes[key] = 0;
            ingresosPorMes[key] += valor;
        });

        setSesionesMes({total: t30Mes + t60Mes, t30: t30Mes, t60: t60Mes});
        setRecaudadoMes(totalMes);
        setRecaudadoTotal(totalGlobal);

        // Calcular faltante con promedio (máx + mín / 2)
        const valores = Object.values(ingresosPorMes).filter((v) => v > 0);
        if (valores.length > 0) {
            const max = Math.max(...valores);
            const min = Math.min(...valores);
            const promedio = (max + min) / 2;
            const faltante = meta - totalGlobal;
            setTurnosFaltantes(Math.max(Math.ceil(faltante / promedio), 0));
        } else {
            setTurnosFaltantes(0);
        }

        // preparar datos para gráfico
        const meses = Object.keys(ingresosPorMes).map((key) => {
            const [y, m] = key.split("-");
            return {
                mes: `${new Date(y, m - 1).toLocaleString("es-ES", {
                    month: "short",
                })} ${y}`,
                ingreso: ingresosPorMes[key],
            };
        });
        setChartData(meses);
    }, [events, valor30, valor60, meta, fechaInicio]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-indigo-700">
                    Panel de Administración
                </h1>
                <AuthButton/>
            </header>

            {/* Main */}
            <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-600">Meta</label>
                        <input
                            type="number"
                            value={meta}
                            onChange={(e) => setMeta(Number(e.target.value))}
                            className="w-full p-3 rounded-lg border"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-600">
                            Valor 30min
                        </label>
                        <input
                            type="number"
                            value={valor30}
                            onChange={(e) => setValor30(Number(e.target.value))}
                            className="w-full p-3 rounded-lg border"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-600">
                            Valor 60min
                        </label>
                        <input
                            type="number"
                            value={valor60}
                            onChange={(e) => setValor60(Number(e.target.value))}
                            className="w-full p-3 rounded-lg border"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-600">
                            Fecha inicio actividad
                        </label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="w-full p-3 rounded-lg border"
                        />
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card title="Meta" value={`$${meta.toLocaleString("es-AR")}`}/>
                    <Card
                        title={`Recaudado en ${mesActualNombre}`}
                        value={`${Utils.formatCurrency(recaudadoMes)}`}
                        subtitle={`(${sesionesMes.t30}x30min / ${sesionesMes.t60}x60min)`}
                    />
                    <Card
                        title="Total Recaudado"
                        value={`$${recaudadoTotal.toLocaleString("es-AR")}`}
                    />
                    <Card
                        title="Meses faltantes"
                        value={`${turnosFaltantes} meses`}
                        subtitle="estimado con promedio"
                    />
                </div>

                {/* Gráfico */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold text-indigo-700 mb-4">
                        Ingresos por mes
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="mes"/>
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="ingreso" fill="#4f46e5"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Calendario */}
                <div className="bg-white shadow-xl rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-indigo-700 mb-4">
                        Calendario de turnos
                    </h2>
                    <div style={{height: 500}}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor={(event) => new Date(event.start)}
                            endAccessor={(event) => new Date(event.end)}
                            selectable
                            messages={messages}
                            views={{month: true, week: true, day: true, agenda: true}}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

function Card({title, value, subtitle}) {
    return (
        <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-indigo-700">{value}</p>
            {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
    );
}
