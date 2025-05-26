/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import axios from "axios";

const ClienteCupones = () => {
  const params = useParams();

  // Extraer el clienteId correctamente desde localStorage si no viene en la URL
  let clienteId = params.clienteId;
  if (!clienteId) {
    const userStr = localStorage.getItem("recicash_user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        // El id correcto es userObj.id
        clienteId = userObj.id;
      } catch {
        clienteId = null;
      }
    }
  }

  // Log para depuración
  console.log("ID del cliente usado:", clienteId);

  if (!clienteId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-700 font-bold">
          No se encontró el cliente. Revisa la URL o inicia sesión nuevamente.
        </p>
      </div>
    );
  }

  const [cuponesDisponibles, setCuponesDisponibles] = useState([]);
  const [cuponesCliente, setCuponesCliente] = useState([]);
  const [participando, setParticipando] = useState(null);

  useEffect(() => {
    fetchCupones();
  }, [clienteId]);

  const fetchCupones = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cupon`)
      .then((res) =>
        setCuponesDisponibles(Array.isArray(res.data) ? res.data : [])
      )
      .catch(() => setCuponesDisponibles([]));

    axios
      .get(`${import.meta.env.VITE_API_URL}/cliente/${clienteId}/cupones`)
      .then((res) =>
        setCuponesCliente(
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.cupones)
            ? res.data.cupones
            : []
        )
      )
      .catch(() => setCuponesCliente([]));
  };

  const handleParticipar = async (cuponId) => {
    if (!clienteId) {
      alert("No se encontró el cliente.");
      return;
    }
    setParticipando(cuponId);
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/cupon/${cuponId}/agregar-cliente/${clienteId}`
      );
      fetchCupones();
    } catch {
      alert("No se pudo participar en el cupón.");
    }
    setParticipando(null);
  };

  // Para evitar que el cliente participe dos veces en el mismo cupón
  const yaParticipa = (cuponId) => cuponesCliente.some((c) => c.id === cuponId);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-[#6A994E] to-[#A7C957]">
      <div className="flex flex-1 p-6 gap-6">
        <Sidebar />
        <div className="flex flex-col items-center min-w-2/3 justify-start min-h-screen w-full">
          <h1 className="text-5xl text-white font-black mb-8 text-center">
            Cupones Disponibles
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
            {cuponesDisponibles.length === 0 ? (
              <div className="col-span-full text-gray-200 text-center py-8 bg-green-900/40 rounded-2xl">
                No hay cupones disponibles.
              </div>
            ) : (
              cuponesDisponibles.map((cupon) => (
                <div
                  key={cupon.id}
                  className="rounded-2xl shadow-xl bg-green-900/40 border-2 border-green-800 p-6 flex flex-col gap-2 relative transition-all"
                >
                  <h2 className="text-2xl font-black text-white mb-2">
                    {cupon.titulo || cupon.nombre}
                  </h2>
                  <p className="text-white mb-1">
                    {cupon.detalles || cupon.descripcion}
                  </p>
                  <div className="flex flex-wrap gap-2 text-white text-lg font-bold">
                    <span>
                      Precio: <span className="font-mono">${cupon.precio}</span>
                    </span>
                    <span>
                      Cantidad:{" "}
                      <span className="font-mono">{cupon.cantidad}</span>
                    </span>
                  </div>
                  <div className="text-white text-sm mt-2">
                    Expira:{" "}
                    <span className="font-mono">{cupon.fechaExpiracion}</span>
                  </div>
                  {cupon.empresaNombre && (
                    <span className="text-sm text-gray-300 mt-2">
                      Empresa:{" "}
                      {cupon.empresaNombre ||
                        cupon.empresa?.nombre ||
                        cupon.empresa ||
                        "Desconocida"}
                    </span>
                  )}
                  <button
                    className={`mt-4 px-4 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-bold transition ${
                      yaParticipa(cupon.id)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => handleParticipar(cupon.id)}
                    disabled={
                      yaParticipa(cupon.id) || participando === cupon.id
                    }
                  >
                    {yaParticipa(cupon.id)
                      ? "Ya participas"
                      : participando === cupon.id
                      ? "Solicitando participación..."
                      : "Pujar"}
                  </button>
                </div>
              ))
            )}
          </div>

          <h1 className="text-4xl text-white font-black mb-8 text-center">
            Tus Cupones Participados
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {cuponesCliente.length === 0 ? (
              <div className="col-span-full text-gray-400 text-center py-8 bg-green-900/40 rounded-2xl">
                No has participado en ningún cupón.
              </div>
            ) : (
              cuponesCliente.map((cupon) => (
                <div
                  key={cupon.id}
                  className="rounded-2xl shadow-xl bg-green-900/40 border-2 border-green-800 p-6 flex flex-col gap-2 relative transition-all"
                >
                  <h2 className="text-xl font-black text-white mb-2">
                    {cupon.titulo || cupon.nombre}
                  </h2>
                  <p className="text-white mb-1">
                    {cupon.detalles || cupon.descripcion}
                  </p>
                  <div className="flex flex-wrap gap-2 text-white text-lg font-bold">
                    <span>
                      Precio: <span className="font-mono">${cupon.precio}</span>
                    </span>
                    <span>
                      Cantidad:{" "}
                      <span className="font-mono">{cupon.cantidad}</span>
                    </span>
                  </div>
                  <div className="text-white text-sm mt-2">
                    Expira:{" "}
                    <span className="font-mono">{cupon.fechaExpiracion}</span>
                  </div>
                  {cupon.empresaNombre && (
                    <span className="text-sm text-gray-300 mt-2">
                      Empresa:{" "}
                      {cupon.empresaNombre ||
                        cupon.empresa?.nombre ||
                        cupon.empresa ||
                        "Desconocida"}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteCupones;
