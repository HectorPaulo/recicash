import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/Sidebar";
import {useAuth} from "../../contexts/AuthContext.jsx";

const CuponListTodasEmpresas = () => {
  const [cupones, setCupones] = useState([]);
  const [participando, setParticipando] = useState(null);
  const clienteId = localStorage.getItem("clienteId");
  const { isAdmin, isEmpresa, isCliente } = useAuth();

  useEffect(() => {
    fetchCupones();
  }, []);

  const fetchCupones = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cupon`)
      .then((res) => setCupones(res.data))
      .catch(() => setCupones([]));
  };

  const handleParticipar = async (cuponId) => {
    if (!clienteId) {
      alert("No se encontró el cliente.");
      return;
    }
    setParticipando(cuponId);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cupon/${cuponId}/agregar-cliente/${clienteId}`
      );
      fetchCupones();
    } catch {
      alert("No se pudo participar en el cupón.");
    }
    setParticipando(null);
  };

  return (
    <div className="flex bg-gradient-to-t from-[#6A994E] to-[#A7C957] pt-15">
      <Sidebar />

      <div className="min-h-screen flex flex-col w-full items-center">
        <h2 className="text-6xl font-black text-green-800 mb-8">
          Todos los cupones disponibles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {cupones.length === 0 && (
            <div className="col-span-full text-center text-xl text-green-900 font-bold">
              No hay cupones disponibles.
            </div>
          )}
          {cupones.map((cupon) => (
            <div
              key={cupon.id}
              className="rounded-2xl shadow-xl bg-green-900/40 border-2 border-green-800 p-6 flex flex-col gap-2"
            >
              <h2 className="text-2xl font-black text-white mb-2">
                {cupon.titulo || cupon.nombre}
              </h2>
              <p className="text-white mb-1">
                {cupon.detalles || cupon.descripcion}
              </p>
              <div className="flex flex-wrap gap-2 text-white text-lg font-bold">
                <span>
                  Remuneración:{" "}
                  <span className="font-mono">${cupon.precio}</span>
                </span>
                <span>
                  Cupos:{" "}
                  <span className="font-mono">{cupon.cantidad}</span>
                </span>
              </div>
              <div className="text-white text-sm mt-2">
                Expira:{" "}
                <span className="font-mono">{cupon.fechaExpiracion}</span>
              </div>
              {cupon.empresaNombre && (
                <div className="text-white text-sm mt-2">
                  Empresa:{" "}
                  <span className="font-mono">{cupon.empresaNombre}</span>
                </div>
              )}
              {!isAdmin && (
              <button
                onClick={() => handleParticipar(cupon.id)}
                disabled={participando === cupon.id}
                className="mt-4 bg-green-800 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out"
              >
                {participando === cupon.id
                  ? "Participando..."
                  : "Participar en este cupón"}
              </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CuponListTodasEmpresas;
