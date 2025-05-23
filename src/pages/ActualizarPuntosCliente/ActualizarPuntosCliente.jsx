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
    <div>
      <input
        type="number"
        value={puntos}
        onChange={(e) => setPuntos(e.target.value)}
      />
      <button onClick={handleUpdate}>Actualizar Puntos</button>
    </div>
  );
};

export default ActualizarPuntos;
