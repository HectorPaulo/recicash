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
    isAdmin && { to: "/clientes", label: "Clientes" },
    isAdmin && { to: "/empresas", label: "Empresas" },
    isAdmin && { to: "/registrar-empresa", label: "Registrar empresa" },
    isEmpresa && { to: "/cupon", label: "Cupones Empresa" },
    isEmpresa && { to: "/actualizardatoscliente", label: "Actualizar puntos" },
    // Agrega aquí para empresa y cliente:
    (isEmpresa || isCliente) && {
      to: "/movimientosrecientes",
      label: "Movimientos Recientes",
    },
    isCliente && { to: "/actualizardatoscliente", label: "Actualizar Datos" },
    isCliente && { to: "/miscupones", label: "Mis Cupones" },
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
          fixed top-0 left-0 h-full -mt-20 z-40  p-6 rounded-xl
          w-64 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-70 md:h-150 md:rounded-xl md:p-6
        `}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-2xl font-black text-white">Navegación</h2>
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
        <svg
          className="w-1/3 h-1/3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="#fff"
        >
          <path d="M480-100q-79 0-148-30t-120.5-81.5Q160-263 130-332t-30-148q0-79 30-148t81.5-120.5Q263-800 332-830t148-30v-100l160 160-160 160v-100q-108 0-184 76t-76 184q0 66 30.5 122.5T332-266q16-28 47.5-47.5T452-338q-3-21-8-42t-12-39q-11 9-24 14t-28 5q-33 0-56.5-23.5T300-480v-40q0-17-5.5-32T280-580q50-1 89 9 34 9 62 29.5t29 61.5q0 9-1.5 16.5T453-448q-13-10-26-18t-27-14q17 13 39 40t41 64q20-49 50-96.5t70-87.5q-23 16-44 34t-41 38q-7-11-11-24.5t-4-27.5q0-42 29-71t71-29h40q23 0 38-6t25-14q11-9 17-20 4 67-7 120-9 45-34 82.5T600-440q-15 0-28.5-4T547-455q-7 19-16 50.5T517-337q38 7 67 26t44 45q51-35 81.5-91T740-480h120q0 79-30 148t-81.5 120.5Q697-160 628-130t-148 30Z" />
        </svg>
        <div className="flex flex-col justify-center h-3/4">
          <div className="flex flex-col justify-center">
            <ul className="space-y-10 text-gray-200">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <li
                    key={link.to}
                    className={`flex items-center gap-2 ${
                      isActive ? "text-green-600 font-black" : "text-gray-200"
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
