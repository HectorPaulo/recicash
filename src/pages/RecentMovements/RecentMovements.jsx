import React, { useEffect, useState } from "react";
      import { useAuth } from "../../contexts/AuthContext";

      const RecentMovements = () => {
        const [cupones, setCupones] = useState([]);
        const [loading, setLoading] = useState(true);
        const { currentUser, isCliente, isEmpresa } = useAuth();

        useEffect(() => {
          if (!currentUser?.id) return;
          setLoading(true);

          let url = "";
          if (isCliente) {
            url = `${import.meta.env.VITE_API_URL}/cliente/${currentUser.id}/cupones`;
          } else if (isEmpresa) {
            url = `${import.meta.env.VITE_API_URL}/cupon/empresa/${currentUser.id}`;
          }

          if (!url) return setLoading(false);

          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              const cuponesData = Array.isArray(data)
                ? data
                : Array.isArray(data?.cupones)
                ? data.cupones
                : [];
              setCupones(cuponesData);
            })
            .catch(() => setCupones([]))
            .finally(() => setLoading(false));
        }, [currentUser, isCliente, isEmpresa]);

        return (
          <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-5xl mx-auto px-4">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Movimientos Recientes
                </h2>
                <p className="text-gray-600">
                  Consulta tus últimos movimientos de cupones.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow">
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Cargando movimientos...</span>
                    </div>
                  ) : cupones.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No hay movimientos recientes.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expira</th>
                            {isEmpresa && (
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Participantes</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {cupones.map((cupon) => (
                            <tr key={cupon.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-2 font-medium text-gray-900">{cupon.titulo || cupon.nombre}</td>
                              <td className="px-4 py-2 text-gray-700">${cupon.precio?.toLocaleString()}</td>
                              <td className="px-4 py-2 text-gray-700">{cupon.detalles || cupon.descripcion || "-"}</td>
                              <td className="px-4 py-2 text-gray-700">{new Date(cupon.fechaExpiracion).toLocaleDateString()}</td>
                              {isEmpresa && (
                                <td className="px-4 py-2 text-gray-700">
                                  {cupon.clientes?.length ?? 0}
                                </td>
                              )}
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
        );
      };

      export default RecentMovements;