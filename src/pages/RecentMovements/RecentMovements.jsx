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
    <div className="min-h-screen  flex flex-col bg-gradient-to-t from-[#6A994E] to-[#A7C957]">
      <div className="flex flex-1 p-6 gap-6">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            <h2 className="text-6xl text-center mb-30 text-white font-black">
              Movimientos recientes
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b-4 text-white">
                    <th className="pb-2 font-black">TÍTULO</th>
                    <th className="pb-2 font-black">PRECIO</th>
                    <th className="pb-2 font-black">CANTIDAD</th>
                    <th className="pb-2 font-black">DETALLES</th>
                    <th className="pb-2 font-black">FECHA EXPIRACIÓN</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {cupones.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-white font-black py-4">
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentMovements;
