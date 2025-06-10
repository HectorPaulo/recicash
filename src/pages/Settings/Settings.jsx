import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { Shield, User, Mail, Phone, AlertTriangle } from "lucide-react";

const Settings = () => {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        nombre: currentUser?.nombre || currentUser?.user_id?.nombre || "",
        email: currentUser?.email || currentUser?.user_id?.email || "",
        telefono: currentUser?.telefono || currentUser?.user_id?.telefono || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch("https://proyectodesarrollo-94d5.onrender.com/api/auth/update/", {
        id: currentUser.id,
        ...form,
      });
      setCurrentUser && setCurrentUser({ ...currentUser, ...form });
      await Swal.fire("¡Listo!", "Datos actualizados correctamente.", "success");
    } catch (error) {
      await Swal.fire("Error", "Error al actualizar los datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarCuenta = async () => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará tu cuenta permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        const clienteId = currentUser?.id || currentUser?.user_id?.id;
        await axios.delete(`https://proyectodesarrollo-94d5.onrender.com/api/cliente/${clienteId}`);
        await Swal.fire("Cuenta eliminada", "Tu cuenta ha sido eliminada.", "success");
        // Cerrar sesión primero
        localStorage.removeItem("recicash_user");
        // Asegurar que la redirección ocurra después del logout
        setTimeout(() => {
          window.location.href = "/login";
        }, 100);
      } catch (error) {
        await Swal.fire("Error", "No se pudo eliminar la cuenta.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Configuración de Cuenta</h1>
              <p className="text-emerald-100 text-sm">Gestione su información personal y preferencias</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Encabezado de la tarjeta */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">Información de Perfil</h2>
            <p className="text-sm text-gray-500">Revise y gestione los detalles de su cuenta</p>
          </div>

          {/* Contenido de la tarjeta */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Columna izquierda - Avatar e info */}
              <div className="lg:w-1/3">
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">{form.nombre}</h3>
                  <p className="text-gray-500 mb-4">{currentUser?.user_id?.rol || "Cliente"}</p>
                  
                  <div className="w-full border-t border-gray-200 pt-4 mt-2">
                    <div className="flex items-center mb-3">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 text-sm">{form.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 text-sm">{form.telefono || "No especificado"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Formulario */}
              <div className="lg:w-2/3">
                <form onSubmit={handleGuardar} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Nombre completo</label>
                    <input
                      type="text"
                      name="nombre"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                      value={form.nombre}
                      onChange={handleChange}
                      disabled={true}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">Contacte con soporte para modificar este campo</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                      value={form.email}
                      onChange={handleChange}
                      disabled={true}
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">Contacte con soporte para modificar este campo</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-500"
                      value={form.telefono}
                      onChange={handleChange}
                      disabled={true}
                    />
                    <p className="mt-1 text-sm text-gray-500">Contacte con soporte para modificar este campo</p>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Gestión de cuenta</h3>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Zona de peligro</h3>
                          <p className="text-sm text-red-700 mt-1">
                            La eliminación de su cuenta es permanente y no se puede deshacer.
                            Todos sus datos serán eliminados de nuestro sistema.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="w-full sm:w-auto bg-white border border-red-300 hover:bg-red-50 text-red-700 font-medium px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center"
                      onClick={handleEliminarCuenta}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"></span>
                      ) : null}
                      Eliminar mi cuenta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;