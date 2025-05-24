// ?? <--
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ClienteCupones = () => {
  const { clienteId } = useParams();
  const [cupones, setCupones] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cliente/${clienteId}/cupones`)
      .then((res) => setCupones(res.data))
      .catch(() => setCupones([]));
  }, [clienteId]);

  return (
    <div>
      <Navbar />
      <h2>Cupones del Cliente</h2>
      <ul>
        {cupones.map((cupon) => (
          <li key={cupon.id}>{cupon.nombre}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClienteCupones;
