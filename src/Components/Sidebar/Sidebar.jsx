import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, isEmpresa, isCliente } = useAuth();

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/dashboard", label: "Panel" },
    isAdmin && { to: "/clientes", label: "Listado de clientes" },
    isAdmin && { to: "/empresas", label: "Empresa registrada" },
    isAdmin && { to: "/registrar-empresa", label: "Registrar empresa" },
    isEmpresa && { to: "/cupon", label: "Cupones Empresa" },
    isCliente && { to: "/movimientosrecientes", label: "Mis Cupones" },
    { to: "/actualizardatoscliente", label: "Actualizar puntos" },
    { to: "/settings", label: "Preferencias" },
  ].filter(Boolean);

  return (
    <div className="w-70 h-150 bg-white rounded-xl border-b-8 border-l-8 border-r-2 border-t-2 border-green-800 p-6">

      <h2 className="text-3xl font-black text-center mb-6 text-green-900">Navegación</h2>
    <div className="flex flex-col justify-center h-3/4">
      <div className="flex flex-col justify-center">

      <ul className="space-y-10 text-gray-700">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <li
            key={link.to}
            className={`flex items-center gap-2 ${
              isActive ? "text-green-600 font-bold" : "text-gray-500"
            }`}
            >
              <span
                className={`w-2 h-2 rounded-full inline-block ${
                  isActive ? "bg-green-500" : "bg-gray-300"
                }`}
                ></span>
              <Link
                to={link.to}
                className={`hover:text-green-600 ${
                  isActive ? "pointer-events-none" : ""
                }`}
                >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      </div>
    </div>
        </div>
  );
};

export default Sidebar;
