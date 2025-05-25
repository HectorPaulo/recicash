import axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    axios
      .get("https://proyectodesarrollo-94d5.onrender.com/api/empresa"
      )
      .then((res) => {
        setEmpresas(res.data);
      })
      .catch(() => setEmpresas([]));
  }, []);

  return (
    <div className="min h-screen flex flex-col mt-15">
      <div className="flex flex-1 p-6 gap-6">
        <Sidebar />

        <div className="flex flex-col items-center min-w-2/3 justify-start min-h-screen">
          <h1 className="text-6xl text-blue-950 font-black mb-4">
            Empresas
          </h1>
          <div className="overflow-x-auto w-full max-w-3xl">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Empresa</th>
                  <th className="py-2 px-4 border-b">Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="text-center">
                    <td className="py-2 px-4">{empresa.empresa || "-"}</td>
                    <td className="py-2 px-4">{empresa.ubicacion || "-"}</td>
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

export default Empresas;
