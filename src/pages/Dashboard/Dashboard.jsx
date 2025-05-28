import React, { useEffect, useState } from "react";
                                    import { Link } from "react-router-dom";
                                    import { useAuth } from "../../contexts/AuthContext";
                                    import axios from "axios";
                                    import { usePuntos } from "../../contexts/PuntosProvider.tsx";

                                    function getStatusBadge(fechaExpiracion) {
                                      const expira = new Date(fechaExpiracion);
                                      const hoy = new Date();
                                      if (expira < hoy) {
                                        return (
                                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                            Expirado
                                          </span>
                                        );
                                      }
                                      return (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                          Activo
                                        </span>
                                      );
                                    }

                                    const Dashboard = () => {
                                      const { currentUser, isCliente, isEmpresa } = useAuth();
                                      const [cupones, setCupones] = useState([]);
                                      const [loading, setLoading] = useState(true);
                                      const horaActual = new Date().getHours();
                                      const mensajeDormir = (horaActual >= 19 || horaActual <= 6) ? " ¡Es hora de dormir!" : "";
                                      const email = currentUser?.email || currentUser?.user_id?.email || "-";
                                      const telefono = currentUser?.telefono || currentUser?.user_id?.telefono || "-";
                                      const { puntos, setPuntos } = usePuntos();
                                      const nombre = currentUser?.nombre || currentUser?.user_id?.nombre || "Usuario";
                                      const rol = isCliente ? "Cliente" : isEmpresa ? "Empresa" : "Usuario";

                                      useEffect(() => {
                                        if (!currentUser?.id) return;
                                        setLoading(true);

                                        if (isCliente) {
                                          axios
                                            .get(`${import.meta.env.VITE_API_URL}/cliente/${currentUser.id}/cupones`)
                                            .then((res) => {
                                              // Soporta ambas estructuras: array directo o { cupones: [...] }
                                              const cuponesCliente = Array.isArray(res.data)
                                                ? res.data
                                                : Array.isArray(res.data?.cupones)
                                                ? res.data.cupones
                                                : [];
                                              setCupones(cuponesCliente);
                                              const puntosAcumulados = cuponesCliente.reduce((acc, cupon) => acc + (cupon.precio || 0), 0);
                                              setPuntos(puntosAcumulados);
                                            })
                                            .catch(() => {
                                              setCupones([]);
                                              setPuntos(0);
                                            })
                                            .finally(() => setLoading(false));
                                        }

                                        if (isEmpresa) {
                                          axios
                                            .get(`${import.meta.env.VITE_API_URL}/cupon/empresa/${currentUser.id}`)
                                            .then((res) => setCupones(Array.isArray(res.data) ? res.data : []))
                                            .catch(() => setCupones([]))
                                            .finally(() => setLoading(false));
                                        }
                                      }, [currentUser, isCliente, isEmpresa, setPuntos]);

                                      // Cupones activos: fechaExpiracion > hoy
                                      const cuponesActivos = cupones.filter(
                                        cupon => new Date(cupon.fechaExpiracion) > new Date()
                                      );

                                      // Valor total para empresa: suma de precio * cantidad de todos los cupones
                                      const valorTotalEmpresa = cupones.reduce(
                                        (total, cupon) => total + ((cupon.precio || 0) * (cupon.cantidad || 0)),
                                        0
                                      );

                                      return (
                                        <div className="min-h-screen bg-gray-50">
                                          <div className="flex">
                                            <div className="flex-1 p-8">
                                              <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                                  Bienvenido, {nombre}.{mensajeDormir}
                                                </h1>
                                                <p className="text-gray-600">
                                                  Gestiona tu cuenta y revisa tus movimientos recientes
                                                </p>
                                              </div>

                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                {/* Total de cupones */}
                                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                                  <div className="flex items-center justify-between">
                                                    <div>
                                                      <p className="text-sm font-medium text-gray-600">
                                                        {isCliente ? "Cupones Participados" : "Cupones Creados"}
                                                      </p>
                                                      <p className="text-3xl font-bold text-gray-900">{cupones.length}</p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Valor total o puntos */}
                                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                                  <div className="flex items-center justify-between">
                                                    <div>
                                                      <p className="text-sm font-medium text-gray-600">
                                                        {isCliente ? "Puntos Acumulados" : "Valor Total"}
                                                      </p>
                                                      <p className="text-3xl font-bold text-gray-900">
                                                        {isCliente
                                                          ? puntos
                                                          : `$${valorTotalEmpresa.toLocaleString()}`}
                                                      </p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Cupones activos */}
                                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                                  <div className="flex items-center justify-between">
                                                    <div>
                                                      <p className="text-sm font-medium text-gray-600">Cupones Activos</p>
                                                      <p className="text-3xl font-bold text-gray-900">{cuponesActivos.length}</p>
                                                    </div>
                                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Tabla de cupones participados */}
                                              {isCliente && (
                                                <div className="bg-white rounded-xl border border-gray-200 my-8">
                                                  <div className="p-6 border-b border-gray-200">
                                                    <h4 className="text-xl font-bold text-gray-900">
                                                      Cupones Participados
                                                    </h4>
                                                  </div>
                                                  <div className="p-6">
                                                    {cupones.length === 0 ? (
                                                      <div className="text-center py-8 text-gray-500">
                                                        No has participado en ningún cupón.
                                                      </div>
                                                    ) : (
                                                      <div className="overflow-x-auto">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                          <thead className="bg-gray-50">
                                                            <tr>
                                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expira</th>
                                                            </tr>
                                                          </thead>
                                                          <tbody className="bg-white divide-y divide-gray-100">
                                                            {cupones.map((cupon) => (
                                                              <tr key={cupon.id} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-4 py-2 font-medium text-gray-900">{cupon.titulo || cupon.nombre}</td>
                                                                <td className="px-4 py-2 text-gray-700">${cupon.precio?.toLocaleString()}</td>
                                                                <td className="px-4 py-2 text-gray-700">{cupon.cantidad}</td>
                                                                <td className="px-4 py-2">{getStatusBadge(cupon.fechaExpiracion)}</td>
                                                                <td className="px-4 py-2 text-gray-700">{new Date(cupon.fechaExpiracion).toLocaleDateString()}</td>
                                                              </tr>
                                                            ))}
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              )}

                                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                <div className="lg:col-span-1">
                                                  <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                                                    <div className="text-center mb-6">
                                                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <span className="text-2xl font-bold text-white">
                                                          {nombre.charAt(0).toUpperCase()}
                                                        </span>
                                                      </div>
                                                      <h3 className="text-xl font-bold text-gray-900 mb-1">{nombre}</h3>
                                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        {rol}
                                                      </span>
                                                    </div>

                                                    <div className="space-y-4">
                                                      <div className="flex items-center text-sm">
                                                        <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                        </svg>
                                                        <span className="text-gray-900">{email}</span>
                                                      </div>
                                                      <div className="flex items-center text-sm">
                                                        <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        <span className="text-gray-900">{telefono}</span>
                                                      </div>
                                                    </div>

                                                    <Link
                                                      to="/settings"
                                                      className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-center font-medium inline-block"
                                                    >
                                                      Editar información
                                                    </Link>
                                                  </div>
                                                </div>

                                                {/* Movimientos recientes */}
                                                <div className="lg:col-span-2">
                                                  <div className="bg-white rounded-xl border border-gray-200">
                                                    <div className="p-6 border-b border-gray-200">
                                                      <div className="flex justify-between items-center">
                                                        <h4 className="text-xl font-bold text-gray-900">
                                                          Movimientos Recientes
                                                        </h4>
                                                        <Link
                                                          to="/movimientosrecientes"
                                                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                                                        >
                                                          Ver todos
                                                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                          </svg>
                                                        </Link>
                                                      </div>
                                                    </div>

                                                    <div className="p-6">
                                                      {loading ? (
                                                        <div className="flex items-center justify-center py-12">
                                                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                          <span className="ml-3 text-gray-600">Cargando movimientos...</span>
                                                        </div>
                                                      ) : cupones.length === 0 ? (
                                                        <div className="text-center py-12">
                                                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                          </svg>
                                                          <p className="text-gray-600">No hay movimientos recientes</p>
                                                        </div>
                                                      ) : (
                                                        <div className="overflow-x-auto">
                                                          <table className="w-full">
                                                            <thead>
                                                              <tr className="border-b border-gray-200">
                                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Título</th>
                                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Precio</th>
                                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cantidad</th>
                                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                                                                <th className="text-left py-3 px-4 font-semibold text-gray-900">Expira</th>
                                                              </tr>
                                                            </thead>
                                                            <tbody>
                                                              {cupones.slice(0, 5).map((cupon, index) => (
                                                                <tr key={cupon.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                                                                  <td className="py-4 px-4">
                                                                    <div>
                                                                      <p className="font-medium text-gray-900">{cupon.titulo || cupon.nombre}</p>
                                                                      <p className="text-sm text-gray-500 truncate max-w-xs">{cupon.detalles || cupon.descripcion}</p>
                                                                    </div>
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                    <span className="font-semibold text-gray-900">${cupon.precio?.toLocaleString()}</span>
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                    <span className="text-gray-700">{cupon.cantidad}</span>
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                    {getStatusBadge(cupon.fechaExpiracion)}
                                                                  </td>
                                                                  <td className="py-4 px-4">
                                                                    <span className="text-gray-700">{new Date(cupon.fechaExpiracion).toLocaleDateString()}</span>
                                                                  </td>
                                                                </tr>
                                                              ))}
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    };

                                    export default Dashboard;