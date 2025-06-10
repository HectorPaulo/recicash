import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import axios from "axios";

const ClienteCupones = () => {
  const params = useParams();
  const [cuponesDisponibles, setCuponesDisponibles] = useState([]);
  const [cuponesCliente, setCuponesCliente] = useState([]);
  const [participando, setParticipando] = useState(null);
  const [puntosCliente, setPuntosCliente] = useState(0);

  let clienteId = params.clienteId;
  if (!clienteId) {
    const userStr = localStorage.getItem("recicash_user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        clienteId = userObj.id;
      } catch {
        clienteId = null;
      }
    }
  }

  const yaParticipa = (cuponId) => cuponesCliente.some((c) => c.id === cuponId);

  useEffect(() => {
    if (clienteId) fetchCupones();
    // eslint-disable-next-line
  }, [clienteId]);

  const fetchCupones = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cupon`)
      .then((res) => {
        setCuponesDisponibles(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setCuponesDisponibles([]));

    axios
      .get(`${import.meta.env.VITE_API_URL}/cliente/${clienteId}/cupones`)
      .then((res) => {
        const cupones = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.cupones)
          ? res.data.cupones
          : [];
        setCuponesCliente(cupones);
        // Solo suma puntos de cupones autorizados
        const puntos = cupones.reduce(
          (acc, cupon) => acc + (cupon.autorizado ? (cupon.precio || 0) : 0),
          0
        );
        setPuntosCliente(puntos);
      })
      .catch(() => {
        setCuponesCliente([]);
        setPuntosCliente(0);
      });
  };

  const handleDesuscribir = async (cuponId) => {
    if (!clienteId) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cupon/${cuponId}/remover-cliente/${clienteId}`
      );
      fetchCupones();
      Swal.fire({
        icon: "success",
        title: "Desuscripción exitosa",
        text: "Te has desuscrito del cupón correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No pudiste desuscribirte del cupón. ¡ESTÁS ATRAPADO😱😰😨!",
      });
    }
  };

  const handleParticipar = async (cupon) => {
    if (!clienteId) {
      alert("No se encontró el cliente.");
      return;
    }
    if (cupon.cantidad <= 0) {
      alert("Ya no hay cupos disponibles para este cupón.");
      return;
    }
    setParticipando(cupon.id);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cupon/${cupon.id}/agregar-cliente/${clienteId}`
      );
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/cupon/${cupon.id}`,
        { cantidad: cupon.cantidad - 1 }
      );
      // Ya NO se asignan puntos automáticamente aquí.
      fetchCupones();
    } catch {
      fetchCupones();
    }
    setParticipando(null);
  };

  if (!clienteId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-700 font-bold">
          No se encontró el cliente. Por favor, inicia sesión nuevamente.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Catálogo de Cupones
          </h1>
          <p className="text-gray-600 text-center">
            Participa en cupones y acumula puntos por cada uno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Puntos acumulados</p>
            <p className="text-3xl font-bold text-green-700">{puntosCliente}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Cupones disponibles</p>
            <p className="text-3xl font-bold text-blue-700">{cuponesDisponibles.filter(c => c.cantidad > 0).length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Cupones participados</p>
            <p className="text-3xl font-bold text-purple-700">{cuponesCliente.length}</p>
          </div>
        </div>

        {/* Cupones Disponibles */}
        <div className="bg-white rounded-xl border border-gray-200 mb-12 shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Cupones Disponibles</h2>
          </div>
          <div className="p-6">
            {cuponesDisponibles.filter(c => c.cantidad > 0).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay cupones disponibles.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cuponesDisponibles
                  .filter(c => c.cantidad > 0)
                  .map((cupon) => (
                    <div
                      key={cupon.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-6 flex flex-col gap-2 shadow hover:shadow-lg transition text-gray-900"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {cupon.titulo || cupon.nombre}
                      </h3>
                      <p className="text-gray-900 mb-1 text-sm">
                        {cupon.detalles || cupon.descripcion}
                      </p>
                      <div className="flex flex-wrap gap-2 text-gray-900 text-base font-semibold">
                        <span>
                          Remuneración: <span className="font-mono">${cupon.precio}</span>
                        </span>
                        <span>
                          Cupo: <span className="font-mono">{cupon.cantidad}</span>
                        </span>
                      </div>
                      <div className="w-full mt-2 text-xs text-gray-500">
                        <span>
                          {cupon.cantidad} / {cupon.cantidadInicial || cupon.cantidad} cupos disponibles
                        </span>
                      </div>
                      <div className="text-gray-700 text-xs mt-2">
                        Expira: <span className="font-mono">{cupon.fechaExpiracion}</span>
                      </div>
                      {cupon.empresa?.nombre && (
                        <span className="text-xs text-gray-500 mt-2">
                          Empresa: {cupon.empresa.nombre}
                        </span>
                      )}
                      <button
                        className={`mt-4 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition ${
                          yaParticipa(cupon.id) || cupon.cantidad <= 0 || participando === cupon.id
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => handleParticipar(cupon)}
                        disabled={
                          yaParticipa(cupon.id) ||
                          participando === cupon.id ||
                          cupon.cantidad <= 0
                        }
                      >
                        {cupon.cantidad <= 0
                          ? "Sin cupos"
                          : yaParticipa(cupon.id)
                          ? "Pujado"
                          : participando === cupon.id
                          ? "Solicitando..."
                          : "Pujar"}
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Cupones Participados */}
        <div className="bg-white rounded-xl border border-gray-200 shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Tus Cupones Participados</h2>
          </div>
          <div className="p-6">
            {cuponesCliente.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No has participado en ningún cupón.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-gray-900">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expira</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {cuponesCliente.map((cupon) => (
                      <tr key={cupon.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 font-medium text-gray-900">{cupon.titulo || cupon.nombre}</td>
                        <td className="px-4 py-2 text-gray-700">${cupon.precio?.toLocaleString()}</td>
                        <td className="px-4 py-2 text-gray-700">{new Date(cupon.fechaExpiracion).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-gray-700">{cupon.empresa?.nombre || "-"}</td>
                        <td className="pl-9 py-1 rounded font-medium text-xs"
                        onClick={() => handleDesuscribir(cupon.id)}>
                          <button onClick={() => handleDesuscribir(cupon.id)} className="cursor-pointer hover:scale-105 text-red-700 py-1 rounded font-medium text-xs">
                            <span className="material-symbols-outlined">
                              delete_forever
                            </span>
                          </button>
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
  );
};

export default ClienteCupones;
