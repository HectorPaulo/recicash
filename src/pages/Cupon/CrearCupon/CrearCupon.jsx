import { useState } from "react";
import axios from "axios";

const CuponCreate = ({ empresaId }) => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cupon/empresa/${empresaId}`,
        { nombre }
      );
      alert("Cupón creado");
    } catch {
      setError("Error al crear cupón");
    }
  };

  return (
    <div>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre cupón"
      />
      <button onClick={handleCreate}>Crear Cupón</button>
      {error && <div>{error}</div>}
    </div>
  );
};

export default CuponCreate;
