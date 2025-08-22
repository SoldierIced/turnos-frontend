"use client";
import {useEffect, useState} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";

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
import CantidadPieChart from "@/components/admin/CantidadPieChart";
import CardEditable from "@/components/admin/CardEditable";
import Loading from "@/components/Loading";

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
    const [loading, setLoading] = useState(true);
    // Normalizar fecha a ISO (YYYY-MM-DD)
    const normalizeDate = (val) => {
        if (!val) return "2025-01-01";
        if (val.includes("/")) {
            // viene en DD/MM/YYYY
            const [d, m, y] = val.split("/");
            return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
        return val; // ya está en ISO
    };

    // Inputs
    const [valor30, setValor30] = useState(0);
    const [valor60, setValor60] = useState(0);
    const [meta, setMeta] = useState(0);
    const [fechaInicio, setFechaInicio] = useState("");
    const [gastosMensual, setGastosMensual] = useState(0);



    const setters = {
        valor30: setValor30,
        valor60: setValor60,
        meta: setMeta,
        fechaInicio: setFechaInicio,
        gastosMensual: setGastosMensual,
    };

    const changeValueState = (property, value) => {
        if (setters[property]) {
            Utils.setCookie(property,value);
            setters[property](value);
        } else {
            console.warn(`No existe el estado con propiedad: ${property}`);
        }
    };

    // Cálculos
    const [turnosFaltantes, setTurnosFaltantes] = useState(0);
    const [sesionesMes, setSesionesMes] = useState({total: 0, t30: 0, t60: 0});
    const [recaudadoMes, setRecaudadoMes] = useState(0);
    const [recaudadoTotal, setRecaudadoTotal] = useState(0);
    const [minMaxText, setMinMaxText] = useState("");

    const [chartData, setChartData] = useState([]);
    const [mesActualNombre, setMesActualNombre] = useState("");
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState("month");

    useEffect(() => {

    }, []);

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
                    setValor30(Number(Utils.getOrDefault("valor30", 20000)));
                    setValor60(Number(Utils.getOrDefault("valor60", 30000)));
                    setMeta(Number(Utils.getOrDefault("meta", 10000000)));
                    setFechaInicio(normalizeDate(Utils.getOrDefault("fechaInicio", "2025-01-01")));
                    setGastosMensual(Number(Utils.getOrDefault("gastosMensual", 700000)));
                    setLoading(false);
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    function diffMeses(inicio, fin) {
        return (fin.getFullYear() - inicio.getFullYear()) * 12 + (fin.getMonth() - inicio.getMonth() + 1);
    }

    // Calcular métricas
    useEffect(() => {
        const ahora = new Date();
        const mesActual = ahora.getMonth();
        const añoActual = ahora.getFullYear();
        const nombreMes = ahora.toLocaleString("es-ES", {month: "long"});
        setMesActualNombre(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));

        let totalMes = 0, totalGlobal = 0;
        let t30Mes = 0, t60Mes = 0;

        const ingresosPorMes = {};

        events.forEach((ev) => {
            const fecha = new Date(ev.start);
            const mes = fecha.getMonth();
            const año = fecha.getFullYear();

            let tipo = "60";
            if (ev.title.includes("(30")) tipo = "30";
            else if (ev.title.includes("(60")) tipo = "60";

            const valor = tipo === "30" ? valor30 : valor60;

            if (new Date(fecha) >= new Date(fechaInicio) && fecha <= ahora) {
                totalGlobal += valor;
            }

            if (mes === mesActual && año === añoActual) {
                totalMes += valor;
                if (tipo === "30") t30Mes++;
                else t60Mes++;
            }

            const key = `${año}-${mes + 1}`;
            if (!ingresosPorMes[key]) {
                ingresosPorMes[key] = {
                    ingreso: 0,
                    ingreso30: 0,
                    ingreso60: 0,
                    cantidad30: 0,
                    cantidad60: 0,
                    gastos: gastosMensual
                };
            }
            if (ev.title.includes("(30")) {
                ingresosPorMes[key].ingreso30 += valor30;
                ingresosPorMes[key].cantidad30++;
                ingresosPorMes[key].ingreso += valor30;
            } else {
                ingresosPorMes[key].ingreso60 += valor60;
                ingresosPorMes[key].cantidad60++;
                ingresosPorMes[key].ingreso += valor60;
            }
        });

        setSesionesMes({total: t30Mes + t60Mes, t30: t30Mes, t60: t60Mes});
        setRecaudadoMes(totalMes - gastosMensual);
        const mesesTranscurridos = diffMeses(new Date(fechaInicio), ahora);
        console.log(totalGlobal,gastosMensual,mesesTranscurridos)
        setRecaudadoTotal(totalGlobal - (gastosMensual * mesesTranscurridos));

        const valores = Object.values(ingresosPorMes)
            .map(mes => mes.ingreso - gastosMensual)
            .filter(valor => valor > 0);

        if (valores.length > 0) {
            const max = Math.max(...valores);
            const min = Math.min(...valores);
            const media = valores.reduce((acc, v) => acc + v, 0) / valores.length;
            const faltante = meta - (totalGlobal - (gastosMensual * mesesTranscurridos));

            setMinMaxText(`${Utils.formatCurrency(min)} - ${Utils.formatCurrency(max)} Media: ${Utils.formatCurrency(media)}`);
            setTurnosFaltantes(Math.max(Math.ceil(faltante / media), 0));
        } else {
            setTurnosFaltantes(0);
        }

        const meses = Object.keys(ingresosPorMes).map((key) => {
            const [y, m] = key.split("-");
            const dateObj = new Date(y, m - 1, 1);
            return {
                mes: `${dateObj.toLocaleString("es-ES", {month: "short"})} ${y}`,
                date: dateObj.toISOString().split("T")[0],
                ...ingresosPorMes[key],
                ingresoNeto: ingresosPorMes[key].ingreso - gastosMensual,
            };
        });

        setChartData(meses);
    }, [events, valor30, valor60, meta, fechaInicio, gastosMensual]);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Loading show={loading} />
            {/* Header */}
            <header className="w-full bg-white shadow px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold  text-army">Panel de Administración</h1>
                <AuthButton/>
            </header>

            <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <CardEditable title="Objetivo" value={meta} type="number" changeValue={(val)=> changeValueState('meta',val)}/>
                    <CardEditable title="Valor 30min" value={valor30} type="number" changeValue={(val)=> changeValueState('valor30',val)}/>
                    <CardEditable title="Valor 60min" value={valor60} type="number" changeValue={(val)=> changeValueState('valor60',val)}/>
                    <CardEditable title="Gastos mensual" value={gastosMensual} type="number" changeValue={(val)=> changeValueState('gastosMensual',val)}/>
                    <CardEditable title="Fecha inicio actividad" value={fechaInicio} type="date" changeValue={(val)=> changeValueState('fechaInicio',val)}/>

                    <Card title={`Recaudado en ${mesActualNombre}`} value={`${Utils.formatCurrency(recaudadoMes)}`} subtitle={`(${sesionesMes.t30}x30min / ${sesionesMes.t60}x60min)`}/>
                    <Card title="Total Recaudado" value={`$${recaudadoTotal.toLocaleString("es-AR")}`}/>
                    <Card title="Meses faltantes" value={`${turnosFaltantes} meses`} subtitle={minMaxText}/>
                </div>

                <CantidadPieChart data={events} startDate={fechaInicio}/>

                {/* Gráfico */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-lg font-semibold text-army mb-4">Ingresos por mes</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="mes"/>
                            <YAxis
                                tickFormatter={(value) => `$${value.toLocaleString("es-AR")}`}
                                domain={[0, (dataMax) => Math.ceil(dataMax / 1000000) * 1000000]}
                                allowDataOverflow
                                padding={{top: 20, bottom: 20}}
                                width={100}
                            />
                            <Tooltip
                                content={({active, payload, label}) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white p-3 shadow rounded text-sm">
                                                <p className="font-bold">{label}</p>
                                                <p>Turno de 30m = Cantidad : {data.cantidad30} = ${data.ingreso30.toLocaleString("es-AR")}</p>
                                                <p>Turno de 60m = Cantidad :  {data.cantidad60} = ${data.ingreso60.toLocaleString("es-AR")}</p>
                                                <p>Gastos = ${data.gastos.toLocaleString("es-AR")}</p>
                                                <p className="font-semibold text-army">
                                                    Neto = ${data.ingresoNeto.toLocaleString("es-AR")}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="ingresoNeto" fill="#6F2DA8" name="Ingresos Netos"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Calendario */}
                <div className="bg-white shadow-xl rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-army mb-4">Calendario de turnos</h2>
                    <div style={{height: 500}}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor={(event) => new Date(event.start)}
                            endAccessor={(event) => new Date(event.end)}
                            messages={messages}
                            views={{month: true, week: true, day: true, agenda: true}}
                            date={date}
                            onNavigate={(newDate) => setDate(newDate)}
                            view={view}
                            onView={(newView) => setView(newView)}
                            style={{height: 500}}
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
            <p className="text-gray-800 text-xl font-bold">{title}</p>
            <p className="text-2xl font-bold text-army">{value}</p>
            {subtitle && (
                <p className="text-gray-400 text-xs flex w-full mt-1 text-center justify-center">
                    <span className="block max-w-[23ch]">{subtitle}</span>
                </p>
            )}
        </div>
    );
}
