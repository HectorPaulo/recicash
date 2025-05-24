import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Link } from "react-router-dom";

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    axios
      .get("https://proyectodesarrollo-94d5.onrender.com/api/cliente")
      .then((res) => {
        setClientes(res.data.clientes || res.data);
      })
      .catch(() => setClientes([]));
  }, []);

  return (
    <div className="min h-screen flex flex-col mt-15">
      <div className="flex flex-1 p-6 gap-6">
        <Sidebar />

        <div className="flex flex-col items-center min-w-2/3 justify-start min-h-screen">
          <h1 className="text-6xl text-blue-950 font-black mb-4">
            Listado de Clientes
          </h1>
          <div className="overflow-x-auto w-full max-w-3xl">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Teléfono</th>
                  <th className="py-2 px-4 border-b">Rol</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="text-center">
                    <td className="py-2 px-4">
                      {cliente.user_id?.nombre || "-"}
                    </td>
                    <td className="py-2 px-4">
                      {cliente.user_id?.email || "-"}
                    </td>
                    <td className="py-2 px-4">
                      {cliente.user_id?.telefono || "-"}
                    </td>
                    <td className="py-2 px-4">
                      {cliente.user_id?.rol || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientesList;
