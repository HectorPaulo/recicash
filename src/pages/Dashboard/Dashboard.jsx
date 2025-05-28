import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { usePuntos } from "../../contexts/PuntosProvider.tsx";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const statusBadgeStyles = {
  active: "bg-emerald-100 text-emerald-800",
  expired: "bg-red-100 text-red-800",
  pending: "bg-amber-100 text-amber-800",
};

function getStatusBadge(fechaExpiracion) {
  const expira = new Date(fechaExpiracion);
  const hoy = new Date();
  return (
      <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
              expira < hoy
                  ? statusBadgeStyles.expired
                  : statusBadgeStyles.active
          }`}
      >
      {expira < hoy ? "Expirado" : "Activo"}
    </span>
  );
}

const Dashboard = () => {
  const { currentUser, isCliente, isEmpresa, isAdmin } = useAuth();
  const [cupones, setCupones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCupones: 0,
    totalValor: 0,
    activos: 0,
  });

  const horaActual = new Date().getHours();
  const mensajeDormir = (horaActual >= 19 || horaActual <= 6) ? " ¡Es hora de descansar!" : "";
  const email = currentUser?.email || currentUser?.user_id?.email || "-";
  const telefono = currentUser?.telefono || currentUser?.user_id?.telefono || "-";
  const { puntos, setPuntos } = usePuntos();
  const nombre = currentUser?.nombre || currentUser?.user_id?.nombre || "Usuario";
  const rol = isCliente ? "Cliente" : isEmpresa ? "Empresa" : isAdmin ? "Administrador" : "Usuario";

  useEffect(() => {
    setLoading(true);
    if (isAdmin) {
      Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/cliente`),
        axios.get(`${import.meta.env.VITE_API_URL}/empresa`),
        axios.get(`${import.meta.env.VITE_API_URL}/cupon`)
      ])
          .then(([clientesRes, empresasRes, cuponesRes]) => {
            const clientesData = Array.isArray(clientesRes.data) ? clientesRes.data : [];
            const empresasData = Array.isArray(empresasRes.data) ? empresasRes.data : [];
            const cuponesData = Array.isArray(cuponesRes.data) ? cuponesRes.data : [];

            setClientes(clientesData);
            setEmpresas(empresasData);
            setCupones(cuponesData);

            // Calcular estadísticas
            const cuponesActivos = cuponesData.filter(
                cupon => new Date(cupon.fechaExpiracion) > new Date()
            );

            setStats({
              totalCupones: cuponesData.length,
              totalValor: cuponesData.reduce(
                  (total, cupon) => total + ((cupon.precio || 0) * (cupon.cantidad || 0)),
                  0
              ),
              activos: cuponesActivos.length,
            });
          })
          .catch(() => {
            setClientes([]);
            setEmpresas([]);
            setCupones([]);
          })
          .finally(() => setLoading(false));
    } else if (isCliente && currentUser?.id) {
      axios
          .get(`${import.meta.env.VITE_API_URL}/cliente/${currentUser.id}/cupones`)
          .then((res) => {
            const cuponesCliente = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.cupones)
                    ? res.data.cupones
                    : [];
            setCupones(cuponesCliente);
            const puntosAcumulados = cuponesCliente.reduce((acc, cupon) => acc + (cupon.precio || 0), 0);
            setPuntos(puntosAcumulados);

            const cuponesActivos = cuponesCliente.filter(
                cupon => new Date(cupon.fechaExpiracion) > new Date()
            );

            setStats({
              totalCupones: cuponesCliente.length,
              totalValor: puntosAcumulados,
              activos: cuponesActivos.length,
            });
          })
          .catch(() => {
            setCupones([]);
            setPuntos(0);
          })
          .finally(() => setLoading(false));
    } else if (isEmpresa && currentUser?.id) {
      axios
          .get(`${import.meta.env.VITE_API_URL}/cupon/empresa/${currentUser.id}`)
          .then((res) => {
            const cuponesData = Array.isArray(res.data) ? res.data : [];
            setCupones(cuponesData);

            const cuponesActivos = cuponesData.filter(
                cupon => new Date(cupon.fechaExpiracion) > new Date()
            );

            const valorTotal = cuponesData.reduce(
                (total, cupon) => total + ((cupon.precio || 0) * (cupon.cantidad || 0)),
                0
            );

            setStats({
              totalCupones: cuponesData.length,
              totalValor: valorTotal,
              activos: cuponesActivos.length,
            });
          })
          .catch(() => setCupones([]))
          .finally(() => setLoading(false));
    }
  }, [currentUser, isCliente, isEmpresa, isAdmin, setPuntos]);

  // --- Gráficas ---
  let chartData = null;
  let chartOptions = null;
  let barChartData = null;

  if (isAdmin) {
    // Gráfica de líneas para cupones por día
    const Dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const cuponesPorDia = Array(7).fill(0);
    cupones.forEach(cupon => {
      const fecha = new Date(cupon.createdAt || cupon.fechaCreacion || cupon.fechaExpiracion);
      if (!isNaN(fecha)) {
        cuponesPorDia[fecha.getDay()]++;
      }
    });

    chartData = {
      labels: Dias,
      datasets: [
        {
          label: "Cupones creados",
          data: cuponesPorDia,
          borderColor: "rgb(108,137,101)",
          backgroundColor: "rgba(79, 70, 229, 0.1)",
          tension: 0.3,
          fill: true,
          yAxisID: "y",
        }
      ]
    };

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
          padding: 12,
          usePointStyle: true,
        }
      },
      interaction: { mode: "index", intersect: false },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: "rgba(0,0,0,0.05)"
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };

    // Gráfica de barras para empresas vs clientes
    barChartData = {
      labels: ["Empresas", "Clientes"],
      datasets: [
        {
          label: "Registros",
          data: [empresas.length, clientes.length],
          backgroundColor: [
            "rgb(21,94,35, 0.7)",
            "rgba(20,147,30,0.7)"
          ],
          borderColor: [
            "rgba(21,94,35, 1)",
            "rgba(16, 185, 129, 1)"
          ],
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    };
  }

  const KpiCard = ({ title, value, icon, color }) => (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-50`}>
            {icon}
          </div>
        </div>
      </div>
  );

  const renderUserProfile = () => (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-800 to-green-950 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <span className="text-3xl font-bold text-white">
            {nombre.charAt(0).toUpperCase()}
          </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{nombre}</h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              isAdmin ? "bg-indigo-100 text-indigo-800" :
                  isEmpresa ? "bg-purple-100 text-green-700-800" :
                      "bg-emerald-100 text-emerald-800"
          }`}>
          {rol}
        </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <span className="text-gray-700">{email}</span>
          </div>
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-gray-700">{telefono}</span>
          </div>
        </div>

        <Link
            to="/settings"
            className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors text-center font-medium inline-block shadow-sm"
        >
          Editar perfil
        </Link>
      </div>
  );

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bienvenido, <span className="text-green-800">{nombre}</span>
                  {mensajeDormir && <span className="text-gray-500 text-lg ml-2">{mensajeDormir}</span>}
                </h1>
                <p className="text-gray-600 mt-2">
                  Resumen de tu actividad y estadísticas importantes
                </p>
              </div>
              <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {!isAdmin ? (
                <>
                  <KpiCard
                      title={isCliente ? "Cupones Participados" : "Cupones Creados"}
                      value={stats.totalCupones}
                      icon={
                        <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      }
                      color="indigo"
                  />
                  <KpiCard
                      title={isCliente ? "Puntos Acumulados" : "Valor Total"}
                      value={isCliente ? puntos : `$${stats.totalValor.toLocaleString()}`}
                      icon={
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      }
                      color="emerald"
                  />
                  <KpiCard
                      title="Cupones Activos"
                      value={stats.activos}
                      icon={
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      }
                      color="purple"
                  />
                </>
            ) : (
                <>
                  <KpiCard
                      title="Clientes"
                      value={clientes.length}
                      icon={
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      }
                      color="blue"
                  />
                  <KpiCard
                      title="Empresas"
                      value={empresas.length}
                      icon={
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      }
                      color="green"
                  />
                  <KpiCard
                      title="Cupones"
                      value={cupones.length}
                      icon={
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      }
                      color="purple"
                  />
                </>
            )}
          </div>

          {/* Gráficas para admin */}
          {isAdmin && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cupones creados por día</h3>
                  <div className="h-64">
                    {chartData && <Line data={chartData} options={chartOptions} />}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Registros en la plataforma</h3>
                  <div className="h-64">
                    {barChartData && <Bar data={barChartData} />}
                  </div>
                </div>
              </div>
          )}

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Perfil de usuario */}
            <div className="lg:col-span-1">
              {renderUserProfile()}
            </div>

            {/* Tablas de contenido */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cupones participados (cliente) */}
              {isCliente && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Tus cupones participados
                      </h4>
                      <Link
                          to="/cupones"
                          className="text-sm font-medium text-green-800 hover:text-indigo-700 flex items-center"
                      >
                        Ver todos
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>

                    {cupones.length === 0 ? (
                        <div className="text-center py-12">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-gray-600">No has participado en ningún cupón aún</p>
                          <Link
                              to="/cupones"
                              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Explorar cupones
                          </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expira</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {cupones.slice(0, 5).map((cupon) => (
                                <tr key={cupon.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">{cupon.titulo || cupon.nombre}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{cupon.detalles || cupon.descripcion}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${cupon.precio?.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(cupon.fechaExpiracion)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(cupon.fechaExpiracion).toLocaleDateString()}
                                  </td>
                                </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                    )}
                  </div>
              )}

              {/* Cupones activos (empresa) */}
              {isEmpresa && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Tus cupones activos
                      </h4>
                      <Link
                          to="/cupones/nuevo"
                          className="text-sm font-medium text-green-800 hover:text-indigo-700 flex items-center"
                      >
                        Crear nuevo
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </Link>
                    </div>

                    {stats.activos === 0 ? (
                        <div className="text-center py-12">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          <p className="text-gray-600">No tienes cupones activos actualmente</p>
                          <Link
                              to="/cupones/nuevo"
                              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Crear primer cupón
                          </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibles</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expira</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {cupones
                                .filter(cupon => new Date(cupon.fechaExpiracion) > new Date())
                                .slice(0, 5)
                                .map((cupon) => (
                                    <tr key={cupon.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div>
                                            <div className="text-sm font-medium text-gray-900">{cupon.titulo || cupon.nombre}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{cupon.detalles || cupon.descripcion}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${cupon.precio?.toLocaleString()}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {cupon.cantidad}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(cupon.fechaExpiracion).toLocaleDateString()}
                                      </td>
                                    </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;