import { useState } from 'react';
import Aurora from '/src/Backgrounds/Aurora/Aurora';
import Sidebar from '../../Components/Sidebar/Sidebar';

const Settings = () => {
  const [activeTab] = useState('account'); // 'account', 'security', 'billing'

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-t from-black">
      {/* Fondo Aurora */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      <div className="min-h-screen z-50  flex flex-col mt-15">
        <div className="flex flex-1 p-6 z-50 gap-6">
          <Sidebar />

          {/* Contenido principal */}
          <div className="relative z-10 container mx-auto pt-20 px-4 pb-10">
            <div className="rounded-xl overflow-hidden">
              {/* Contenedor principal con grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                {/* Contenido principal - 1 columna en móvil, 3 de 4 en escritorio */}
                <div className="lg:col-span-3">
                  {activeTab === "account" && (
                    <div className="bg-white/30 backdrop-blur-sm rounded-lg shadow mb-6">
                      <div className="px-6 py-4">
                        <h2 className="text-green-100 text-center text-6xl font-black">
                          Preferencias de la cuenta
                        </h2>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2">
                            <div className="space-y-6">
                              <div>
                                <label className="block text-gray-800 text-lg font-semibold mb-2">
                                  Nombre
                                </label>
                                <input
                                  type="text"
                                  className="w-1/2 h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                                  defaultValue="Daniel"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-800 text-lg font-semibold mb-2">
                                  Apellido
                                </label>
                                <input
                                  type="text"
                                  className="w-1/2 h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                                  defaultValue="Santiago"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-800 text-lg font-semibold mb-2">
                                  Correo Electrónico
                                </label>
                                <input
                                  type="email"
                                  className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                                  defaultValue="dianne.russell@gmail.com"
                                />
                              </div>

                              <div>
                                <label className="block text-gray-800 text-lg font-semibold mb-2">
                                  Número de Teléfono
                                </label>
                                <input
                                  type="text"
                                  className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                                  defaultValue="(603) 555-0123"
                                />
                              </div>

                              <div className="pt-4">
                                <button className="px-8 py-3.5 bg-green-600 rounded-[43px] text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                                  Guardar Cambios
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="lg:col-span-1">
                            <div className="flex flex-col items-center">
                              <img
                                className="w-56 h-56 rounded-full object-cover mb-4"
                                src="https://github.com/danielpraisethelord.png"
                                alt="Profile"
                              />
                              <button className="px-8 py-3.5 bg-white rounded-[43px] outline outline-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 cursor-pointer transition-colors">
                                Elegir Imagen
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "account" && (
                    <div className="bg-white/30 backdrop-blur-sm rounded-lg shadow mb-6">
                      <div className="px-6 py-4">
                        <h2 className="text-green-100 text-center text-6xl font-black">
                          Información avanzada
                        </h2>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-gray-800 text-lg font-semibold mb-2">
                              Apellido paterno
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                              defaultValue="Santiago"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-800 text-lg font-semibold mb-2">
                              Apellido materno
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                              defaultValue="García"
                            />
                          </div>

                          <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-gray-800 text-lg font-semibold mb-2">
                              Dirección
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                              defaultValue="#123 Col. Centro"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-800 text-lg font-semibold mb-2">
                              Estado
                            </label>
                            <div className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 flex items-center justify-between">
                              <span className="text-gray-950">
                                Oaxaca de Juárez, Oaxaca
                              </span>
                              <span className="w-4 h-4 transform rotate-180">
                                ▴
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-800 text-lg font-semibold mb-2">
                              Códico postal
                            </label>
                            <input
                              type="text"
                              className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                              defaultValue="20033"
                            />
                          </div>

                          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-gray-800 text-lg font-semibold mb-2">
                                Correo electrónico
                              </label>
                              <input
                                type="email"
                                className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                                defaultValue="danieluwu777@gamil.com"
                              />
                            </div>

                            <div>
                              <label className="block text-gray-800 text-lg font-semibold mb-2">
                                Número de teléfono
                              </label>
                              <input
                                type="text"
                                className="w-full h-12 bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 px-4 text-gray-950"
                                defaultValue="+52 951 1234 56"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2 lg:col-span-3 pt-4">
                            <button className="px-8 py-3.5 bg-green-600 rounded-[43px] text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                              Guardar cambios
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cambio de contraseña */}
                  {activeTab === "account" && (
                    <div className="bg-white/30 backdrop-blur-sm rounded-lg shadow">
                      <div className="px-6 py-4">
                        <h2 className="text-green-100 text-center text-6xl font-black">
                          Cambiar contraseña
                        </h2>
                      </div>

                      <div className="p-6">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-gray-800 text-lg font-semibold mb-2">
                              Contraseña actual
                            </label>
                            <div className="w-full bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 flex items-center">
                              <input
                                type="password"
                                className="flex-grow h-12 px-4 text-gray-950 bg-transparent outline-none"
                                placeholder="Contraseña"
                              />
                              <button className="px-2">
                                <span className="w-5 h-5 inline-block">👁️</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-gray-800 text-lg font-semibold mb-2">
                                Nueva contraseña
                              </label>
                              <div className="w-full bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 flex items-center">
                                <input
                                  type="password"
                                  className="flex-grow h-12 px-4 text-gray-950 bg-transparent outline-none"
                                  placeholder="Contraseña"
                                />
                                <button className="px-2">
                                  <span className="w-5 h-5 inline-block">
                                    👁️
                                  </span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-gray-800 text-lg font-semibold mb-2">
                                Confirmar contraseña
                              </label>
                              <div className="w-full bg-white/50 rounded-xl outline outline-offset-[-1px] outline-neutral-200 flex items-center">
                                <input
                                  type="password"
                                  className="flex-grow h-12 px-4 text-gray-950 bg-transparent outline-none"
                                  placeholder="Contraseña"
                                />
                                <button className="px-2">
                                  <span className="w-5 h-5 inline-block">
                                    👁️
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <button className="px-8 py-3.5 bg-green-600 rounded-[43px] text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                              Cambiar contraseña
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-white text-xl md:text-2xl lg:text-3xl font-medium">
              © 2025 ReciCash. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;