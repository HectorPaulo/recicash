import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GooeyNav from "/src/Components/GooeyNav/GooeyNav";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const { isAdmin, isEmpresa, isCliente } = useAuth();

  const handleLogout = async () => {
    try {
      await localStorage.removeItem("recicash_token");
      await localStorage.removeItem("recicash_user");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#175119]/30"
    >
      {/* Versión de escritorio */}
      <div className="hidden md:block mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/home">
                <svg
                  className="h-12 w-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="http://www.w3.org/2000/svg"
                  fill="white"
                >
                  <path d="M480-100q-79 0-148-30t-120.5-81.5Q160-263 130-332t-30-148q0-79 30-148t81.5-120.5Q263-800 332-830t148-30v-100l160 160-160 160v-100q-108 0-184 76t-76 184q0 66 30.5 122.5T332-266q16-28 47.5-47.5T452-338q-3-21-8-42t-12-39q-11 9-24 14t-28 5q-33 0-56.5-23.5T300-480v-40q0-17-5.5-32T280-580q50-1 89 9 34 9 62 29.5t29 61.5q0 9-1.5 16.5T453-448q-13-10-26-18t-27-14q17 13 39 40t41 64q20-49 50-96.5t70-87.5q-23 16-44 34t-41 38q-7-11-11-24.5t-4-27.5q0-42 29-71t71-29h40q23 0 38-6t25-14q11-9 17-20 4 67-7 120-9 45-34 82.5T600-440q-15 0-28.5-4T547-455q-7 19-16 50.5T517-337q38 7 67 26t44 45q51-35 81.5-91T740-480h120q0 79-30 148t-81.5 120.5Q697-160 628-130t-148 30Z" />
                </svg>
              </Link>
            </div>
            <div className="ml-6 flex space-x-4">
              <Link
                to="/home"
                className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <>
                  <Link
                    to="/clientes"
                    className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
                  >
                    Clientes
                  </Link>
                  <Link
                    to="/empresas"
                    className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
                  >
                    Empresas
                  </Link>
                  <Link
                    to="/registrar-empresa"
                    className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
                  >
                    Registrar empresa
                  </Link>
                </>
              )}
              {isEmpresa && (
                <Link
                  to="/cupon"
                  className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
                >
                  Cupones Empresa
                </Link>
              )}
              {(isEmpresa || isCliente) && (
                <Link
                  to="/movimientosrecientes"
                  className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
                >
                  Movimientos Recientes
                </Link>
              )}
              {!isAdmin && (
                <Link
                  to="/actualizardatoscliente"
                  className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
                >
                  Actualizar Datos
                </Link>
              )}
              <Link
                to="/settings"
                className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-bold"
              >
                Preferencias
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Botón de cerrar sesión */}
            <button
              onClick={handleLogout}
              className="text-white bg-red-700 hover:bg-red-800 px-3 py-2 rounded-md text-sm font-bold flex items-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
                className="mr-2"
              >
                <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Versión móvil */}
      <div className="md:hidden w-full p-4">
        <div className="flex justify-between items-center">
          <Link to="/home">
            <svg
              className="w-14 h-14"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="http://www.w3.org/2000/svg"
              fill="white"
            >
              <path d="M480-100q-79 0-148-30t-120.5-81.5Q160-263 130-332t-30-148q0-79 30-148t81.5-120.5Q263-800 332-830t148-30v-100l160 160-160 160v-100q-108 0-184 76t-76 184q0 66 30.5 122.5T332-266q16-28 47.5-47.5T452-338q-3-21-8-42t-12-39q-11 9-24 14t-28 5q-33 0-56.5-23.5T300-480v-40q0-17-5.5-32T280-580q50-1 89 9 34 9 62 29.5t29 61.5q0 9-1.5 16.5T453-448q-13-10-26-18t-27-14q17 13 39 40t41 64q20-49 50-96.5t70-87.5q-23 16-44 34t-41 38q-7-11-11-24.5t-4-27.5q0-42 29-71t71-29h40q23 0 38-6t25-14q11-9 17-20 4 67-7 120-9 45-34 82.5T600-440q-15 0-28.5-4T547-455q-7 19-16 50.5T517-337q38 7 67 26t44 45q51-35 81.5-91T740-480h120q0 79-30 148t-81.5 120.5Q697-160 628-130t-148 30Z" />
            </svg>
          </Link>

          <div className="flex items-center">
            {/* Botón hamburguesa */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="backdrop-blur-md bg-[#175119]/30 mt-4 py-2 rounded-lg">
            <ul className="flex flex-col space-y-2">
              <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                <Link to="/home" className="text-white block">
                  Home
                </Link>
              </li>
              <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                <Link to="/dashboard" className="text-white block">
                  Dashboard
                </Link>
              </li>
              {isAdmin && (
                <>
                  <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                    <Link to="/clientes" className="text-white block">
                      Clientes
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                    <Link to="/empresas" className="text-white block">
                      Empresas
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                    <Link to="/registrar-empresa" className="text-white block">
                      Registrar empresa
                    </Link>
                  </li>
                </>
              )}
              {isEmpresa && (
                <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                  <Link to="/cupon" className="text-white block">
                    Cupones Empresa
                  </Link>
                </li>
              )}
              {(isEmpresa || isCliente) && (
                <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                  <Link to="/movimientosrecientes" className="text-white block">
                    Movimientos Recientes
                  </Link>
                </li>
              )}
              {!isAdmin && (
                <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                  <Link
                    to="/actualizardatoscliente"
                    className="text-white block"
                  >
                    Actualizar Datos
                  </Link>
                </li>
              )}
              <li className="px-4 py-2 hover:bg-green-600/20 hover:backdrop-blur-md">
                <Link to="/settings" className="text-white block">
                  Preferencias
                </Link>
              </li>
              <li className="px-4 py-2 flex items-center cursor-pointer">
                <button
                  onClick={handleLogout}
                  className="text-white flex items-center w-full text-left cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    width="24px"
                    height="24px"
                    className="mr-2"
                  >
                    <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
