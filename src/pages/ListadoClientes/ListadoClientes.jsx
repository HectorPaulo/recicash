import { useEffect, useState } from "react";
import axios from "axios";

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cliente`)
      .then((res) => setClientes(res.data))
      .catch(() => setClientes([]));
  }, []);

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nombre} - {cliente.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesList;
