import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener cupones del usuario activo
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

  const nombre =
    currentUser?.nombre || currentUser?.user_id?.nombre || "Usuario";
  const email = currentUser?.email || currentUser?.user_id?.email || "-";
  const telefono =
    currentUser?.telefono || currentUser?.user_id?.telefono || "-";
  const rol = Array.isArray(currentUser?.rol)
    ? currentUser.rol.join(", ")
    : Array.isArray(currentUser?.user_id?.rol)
    ? currentUser.user_id.rol.join(", ")
    : currentUser?.rol || currentUser?.user_id?.rol || "Cliente";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-[#6A994E] to-[#A7C957]">
      <div className="flex flex-1 p-6 gap-6">
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Section */}
          <div className="flex gap-6">
            <div className="rounded-lg border-2 border-gray-300 p-6 flex-1 text-center">
              <h3 className="font-black text-4xl text-green-900">{nombre}</h3>
              <p className="text-gray-600 mb-2">{rol}</p>
              <Link
                to="/settings"
                className="text-green-800 hover:underline cursor-pointer font-bold"
              >
                Editar información
              </Link>
            </div>

            {/* Billing Address */}
            <div className="rounded-lg border-2 border-gray-300 p-6 flex-1">
              <h4 className="text-2xl text-green-900 font-black mb-4">
                DATOS DE CONTACTO
              </h4>
              <p className="text-gray-800 font-medium">{nombre}</p>
              <p className="text-gray-600">{email}</p>
              <p className="text-gray-600 mb-2">{telefono}</p>
              <Link
                to="/settings"
                className="text-green-800 cursor-pointer font-bold text-lg hover:underline"
              >
                Editar información
              </Link>
            </div>
          </div>

          {/* Recent Movements */}
          <div className="rounded-lg border-2 border-gray-300 p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-2xl font-bold text-green-800">
                Movimientos recientes
              </h4>
              <Link
                to="/movimientosrecientes"
                className="text-green-800 font-bold hover:underline text-sm"
              >
                Ver todos
              </Link>
            </div>
            {loading ? (
              <div>Cargando movimientos...</div>
            ) : cupones.length === 0 ? (
              <div>No hay movimientos recientes.</div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-2">Título</th>
                    <th className="py-2">Precio</th>
                    <th className="py-2">Cantidad</th>
                    <th className="py-2">Detalles</th>
                    <th className="py-2">Expira</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {cupones.slice(0, 5).map((cupon) => (
                    <tr key={cupon.id} className="border-b">
                      <td className="py-2">{cupon.titulo}</td>
                      <td className="py-2 font-semibold">${cupon.precio}</td>
                      <td className="py-2">{cupon.cantidad}</td>
                      <td className="py-2">{cupon.detalles}</td>
                      <td className="py-2">{cupon.fechaExpiracion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
