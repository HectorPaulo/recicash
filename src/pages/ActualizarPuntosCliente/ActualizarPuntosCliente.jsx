/* eslint-disable no-unused-vars */
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const ActualizarPuntos = () => {
  const { currentUser } = useAuth();
  const [puntos, setPuntos] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActualizar = async (e) => {
    e.preventDefault();
    if (!currentUser?.id) {
      setMensaje("Usuario no autenticado.");
      return;
    }
    setLoading(true);
    setMensaje("");
    try {
      await axios.put(
        `https://proyectodesarrollo-94d5.onrender.com/apicliente/${currentUser.id}/puntos`,
        { puntos: Number(puntos) }
      );
      setMensaje("Puntos actualizados correctamente.");
    } catch (error) {
      setMensaje("Error al actualizar los puntos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col mt-15">
      <div className="flex flex-1 p-6 gap-6">
        <Sidebar />
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Actualizar Puntos</h1>
      <h2 className="text-2xl font-bold mb-4">Luego lo termino:D</h2>
      <form onSubmit={handleActualizar} className="space-y-4">
        <input
          type="number"
          min="0"
          value={puntos}
          onChange={(e) => setPuntos(e.target.value)}
          className="border p-2 w-full"
          placeholder="Cantidad de puntos"
          required
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
      {mensaje && <div className="mt-4">{mensaje}</div>}
    </div>
    </div>
    </div>
  );
};

export default ActualizarPuntos;
