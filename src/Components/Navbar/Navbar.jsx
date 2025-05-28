import { useRef, useEffect, useState } from "react";
                  import { gsap } from "gsap";
                  import { Link, useNavigate } from "react-router-dom";
                  import { useAuth } from "../../contexts/AuthContext";

                  const Navbar = () => {
                    const [isMenuOpen, setIsMenuOpen] = useState(false);
                    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
                    const navbarRef = useRef(null);
                    const navigate = useNavigate();
                    const { isAdmin, isEmpresa, isCliente, currentUser } = useAuth();

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

                    const getRoleLabel = () => {
                      if (isAdmin) return "Administrador";
                      if (isEmpresa) return "Empresa";
                      if (isCliente) return "Cliente";
                      return "Usuario";
                    };

                    const getUserInitials = () => {
                      const nombre =
                        currentUser?.nombre ||
                        currentUser?.user_id?.nombre ||
                        "";
                      if (nombre) {
                        return nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);
                      }
                      return "U";
                    };

                    const getUserName = () =>
                      currentUser?.nombre ||
                      currentUser?.user_id?.nombre ||
                      "Usuario";

                    const getUserEmail = () =>
                      currentUser?.email ||
                      currentUser?.user_id?.email ||
                      "usuario@recicash.com";

                    return (
                      <>
                        <nav
                          ref={navbarRef}
                          className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
                        >
                          {/* Versión de escritorio */}
                          <div className="hidden lg:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                              {/* Logo y marca */}
                              <div className="flex items-center">
                                <Link to="/dashboard" className="flex items-center space-x-3 group">
                                  <div className="h-10 w-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                                    <svg
                                      className="mx-auto w-16 h-16 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 -960 960 960"
                                      fill="currentColor"
                                    >
                                      <path d="M480-100q-79 0-148-30t-120.5-81.5Q160-263 130-332t-30-148q0-79 30-148t81.5-120.5Q263-800 332-830t148-30v-100l160 160-160 160v-100q-108 0-184 76t-76 184q0 66 30.5 122.5T332-266q16-28 47.5-47.5T452-338q-3-21-8-42t-12-39q-11 9-24 14t-28 5q-33 0-56.5-23.5T300-480v-40q0-17-5.5-32T280-580q50-1 89 9 34 9 62 29.5t29 61.5q0 9-1.5 16.5T453-448q-13-10-26-18t-27-14q17 13 39 40t41 64q20-49 50-96.5t70-87.5q-23 16-44 34t-41 38q-7-11-11-24.5t-4-27.5q0-42 29-71t71-29h40q23 0 38-6t25-14q11-9 17-20 4 67-7 120-9 45-34 82.5T600-440q-15 0-28.5-4T547-455q-7 19-16 50.5T517-337q38 7 67 26t44 45q51-35 81.5-91T740-480h120q0 79-30 148t-81.5 120.5Q697-160 628-130t-148 30Z" />
                                    </svg>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-900 tracking-tight">ReciCash</span>
                                    <span className="text-xs text-gray-500 font-medium">Plataforma de negocio</span>
                                  </div>
                                </Link>
                              </div>

                              {/* Navegación principal */}
                              <div className="flex items-center space-x-1">
                                <Link
                                  to="/dashboard"
                                  className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                >
                                  Panel de Control
                                </Link>

                                {isAdmin && (
                                  <>
                                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                                    <Link
                                      to="/clientes"
                                      className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                    >
                                      Gestión de Clientes
                                    </Link>
                                    <Link
                                      to="/empresas"
                                      className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                    >
                                      Gestión de Empresas
                                    </Link>
                                    <Link to='/cupon-admin'                                       className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                                      Cupones
                                    </Link>
                                    <Link
                                      to="/registrar-empresa"
                                      className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
                                    >
                                      Registrar Empresa
                                    </Link>
                                  </>
                                )}

                                {isCliente && (
                                  <Link
                                    to="/mis-cupones"
                                    className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                  >
                                    Mis Cupones
                                  </Link>
                                )}

                                {isEmpresa && (
                                  <Link
                                    to="/cupon"
                                    className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                  >
                                    Gestión de Cupones
                                  </Link>
                                )}

                                {(isEmpresa || isCliente) && (
                                  <Link
                                    to="/movimientosrecientes"
                                    className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                  >
                                    Historial de Transacciones
                                  </Link>
                                )}
                              </div>

                              {/* Menú de usuario */}
                              <div className="relative">
                                <button
                                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                  <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900">{getUserName()}</span>
                                    <span className="text-xs text-emerald-600 font-medium">{getRoleLabel()}</span>
                                  </div>
                                  <div className="h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {getUserInitials()}
                                  </div>
                                  <svg
                                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                                      isUserMenuOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {/* Dropdown del usuario */}
                                {isUserMenuOpen && (
                                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                      <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                                      <p className="text-sm text-gray-500">{getUserEmail()}</p>
                                      <span className="inline-block mt-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                        {getRoleLabel()}
                                      </span>
                                    </div>
                                    <Link
                                      to="/settings"
                                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                      onClick={() => setIsUserMenuOpen(false)}
                                    >
                                      <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      Configuración
                                    </Link>
                                    <button
                                      onClick={handleLogout}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                    >
                                      <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                      </svg>
                                      Cerrar Sesión
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Versión móvil */}
                          <div className="lg:hidden">
                            <div className="px-4 py-3">
                              <div className="flex items-center justify-between">
                                <Link to="/home" className="flex items-center space-x-2">
                                  <div className="h-8 w-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                                    <svg
                                      className="h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                                    </svg>
                                  </div>
                                  <span className="text-lg font-bold text-gray-900">ReciCash</span>
                                </Link>

                                <button
                                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                  <svg
                                    className="h-6 w-6 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Menú móvil */}
                            {isMenuOpen && (
                              <div className="bg-white border-t border-gray-200 shadow-lg">
                                <div className="px-4 py-3">
                                  <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                      {getUserInitials()}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                                      <p className="text-xs text-emerald-600 font-medium">{getRoleLabel()}</p>
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <Link
                                      to="/home"
                                      className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors duration-200"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      Inicio
                                    </Link>
                                    <Link
                                      to="/dashboard"
                                      className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors duration-200"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      Panel de Control
                                    </Link>

                                    {isAdmin && (
                                      <>
                                        <div className="my-2 border-t border-gray-200"></div>
                                        <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                          Administración
                                        </p>
                                        <Link
                                          to="/clientes"
                                          className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors duration-200"
                                          onClick={() => setIsMenuOpen(false)}
                                        >
                                          Gestión de Clientes
                                        </Link>
                                        <Link
                                          to="/empresas"
                                          className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors duration-200"
                                          onClick={() => setIsMenuOpen(false)}
                                        >
                                          Gestión de Empresas
                                        </Link>
                                        <Link
                                          to="/registrar-empresa"
                                          className="block px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                                          onClick={() => setIsMenuOpen(false)}
                                        >
                                          Registrar Empresa
                                        </Link>
                                      </>
                                    )}

                                    {isCliente && (
                                      <Link
                                        to="/mis-cupones"
                                        className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        Mis Cupones
                                      </Link>
                                    )}

                                    {isEmpresa && (
                                      <Link
                                        to="/cupon"
                                        className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        Gestión de Cupones
                                      </Link>
                                    )}

                                    {(isEmpresa || isCliente) && (
                                      <Link
                                        to="/movimientosrecientes"
                                        className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        Historial de Transacciones
                                      </Link>
                                    )}

                                    <div className="my-2 border-t border-gray-200"></div>
                                    <Link
                                      to="/settings"
                                      className="block px-3 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-sm font-medium transition-colors duration-200"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      Configuración
                                    </Link>
                                    <button
                                      onClick={handleLogout}
                                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors duration-200"
                                    >
                                      Cerrar Sesión
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </nav>

                        {/* Espaciador para el navbar fijo */}
                        <div className="h-16"></div>
                      </>
                    );
                  };

                  export default Navbar;