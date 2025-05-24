import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const RecentMovements = () => {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.id) return;
    setLoading(true);
    axios
      .get(
        `https://proyectodesarrollo-94d5.onrender.com/api/api/cliente/${currentUser.id}/cupones`
      )
      .then((res) => setCupones(res.data))
      .catch(() => setCupones([]))
      .finally(() => setLoading(false));
  }, [currentUser]);

  if (loading) return <div>Cargando movimientos recientes...</div>;

  return (
    <div className="min-h-screen  flex flex-col mt-15">
      <div className="flex flex-1 p-6 gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-4xl font-semibold mb-6">
              Movimientos recientes
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="pb-2">TÍTULO</th>
                    <th className="pb-2">PRECIO</th>
                    <th className="pb-2">CANTIDAD</th>
                    <th className="pb-2">DETALLES</th>
                    <th className="pb-2">FECHA EXPIRACIÓN</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {cupones.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No hay cupones recientes.
                      </td>
                    </tr>
                  ) : (
                    cupones.map((cupon) => (
                      <tr key={cupon.id} className="border-b hover:bg-green-50">
                        <td className="py-3">{cupon.titulo}</td>
                        <td className="py-3">{cupon.precio}</td>
                        <td className="py-3">{cupon.cantidad}</td>
                        <td className="py-3">{cupon.detalles}</td>
                        <td className="py-3">{cupon.fechaExpiracion}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                ‹
              </button>
              <button className="px-3 py-1 rounded bg-green-500 text-white">
                1
              </button>
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                2
              </button>
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                3
              </button>
              <button className="px-3 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300">
                ›
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-8">
            © 2025 ReciCash. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentMovements;
