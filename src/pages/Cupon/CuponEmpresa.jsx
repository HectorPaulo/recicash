import { useEffect, useState } from "react";
import axios from "axios";

const CuponListEmpresa = ({ empresaId }) => {
  const [cupones, setCupones] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cupon/empresa/${empresaId}`)
      .then((res) => setCupones(res.data))
      .catch(() => setCupones([]));
  }, [empresaId]);

  return (
    <div>
      <h2>Cupones de la Empresa</h2>
      <ul>
        {cupones.map((cupon) => (
          <li key={cupon.id}>{cupon.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default CuponListEmpresa;
