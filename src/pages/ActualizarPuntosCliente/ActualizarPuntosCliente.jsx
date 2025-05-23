import { useState } from "react";
import axios from "axios";

const ActualizarPuntos = ({ clienteId }) => {
  const [puntos, setPuntos] = useState(0);

  const handleUpdate = async () => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/cliente/${clienteId}/puntos`,
      { puntos }
    );
    alert("Puntos actualizados");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Actualizar Puntos</h1>
      <input
      className="border border-gray-300 p-2 mb-4"
        type="number"
        value={puntos}
        onChange={(e) => setPuntos(e.target.value)}
      />
      <button onClick={handleUpdate}>Actualizar Puntos</button>
    </div>
  );
};

export default ActualizarPuntos;
