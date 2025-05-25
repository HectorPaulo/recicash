import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin, isEmpresa, isCliente } = useAuth();
  const [open, setOpen] = useState(false);

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
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-green-800 text-white p-2 rounded"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir menú de navegación"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full -mt-20 z-40 bg-white border-b-8 border-l-8 border-r-2 border-t-2 border-green-800 p-6 rounded-xl
          w-64 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-70 md:h-150 md:rounded-xl md:p-6
        `}
        style={{ minHeight: "95vh", marginTop: "-7vh" }}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-2xl font-black text-green-900">Navegación</h2>
          <button
            className="text-green-800"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú de navegación"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M6 6l12 12M6 18L18 6"
              />
            </svg>
          </button>
        </div>
        {/* Title for desktop */}
        <h2 className="hidden md:block text-3xl font-black text-center mb-6 text-green-900">
          Navegación
        </h2>
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
                      onClick={() => setOpen(false)}
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
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
