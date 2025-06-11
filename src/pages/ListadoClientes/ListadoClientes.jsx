import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Users, Eye, Edit3, Trash2, ChevronLeft, ChevronRight, X, Phone, Mail, User } from "lucide-react";

const PAGE_SIZE = 10;
const API_URL = "https://proyectodesarrollo-94d5.onrender.com/api";

const initialModalState = {
  show: false,
  cliente: null,
};

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailModal, setDetailModal] = useState(initialModalState);
  const [editModal, setEditModal] = useState(initialModalState);
  const [deleteModal, setDeleteModal] = useState(initialModalState);
  const [editForm, setEditForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "",
  });

  useEffect(() => {
    fetchClientes();
    // eslint-disable-next-line
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await axios.get(`${API_URL}/cliente`);
      // Soporta ambos formatos de respuesta
      if (Array.isArray(res.data)) {
        setClientes(res.data);
      } else if (Array.isArray(res.data.clientes)) {
        setClientes(res.data.clientes);
      } else {
        setClientes([]);
      }
      setCurrentPage(1);
    } catch {
      setClientes([]);
    }
  };

  // Filtrar clientes por término de búsqueda
  const filteredClientes = clientes.filter(cliente =>
    (cliente.user_id?.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (cliente.user_id?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (Array.isArray(cliente.user_id?.rol)
      ? cliente.user_id.rol.join(", ").toLowerCase()
      : (cliente.user_id?.rol || "").toLowerCase()
    ).includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / PAGE_SIZE);
  const clientesPagina = filteredClientes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleView = (cliente) => {
    setDetailModal({ show: true, cliente });
  };

  const handleEdit = (cliente) => {
    setEditForm({
      nombre: cliente.user_id?.nombre || "",
      email: cliente.user_id?.email || "",
      telefono: cliente.user_id?.telefono || "",
      rol: Array.isArray(cliente.user_id?.rol)
        ? cliente.user_id.rol.join(", ")
        : cliente.user_id?.rol || "",
    });
    setEditModal({ show: true, cliente });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.patch(`${API_URL}/cliente/${editModal.cliente.id}`, {
        nombre: editForm.nombre,
        email: editForm.email,
        telefono: editForm.telefono,
        rol: editForm.rol,
      });
      setEditModal(initialModalState);
      fetchClientes();
    } catch (error) {
      alert("Error al editar cliente");
    }
  };

  const handleDelete = (cliente) => {
    setDeleteModal({ show: true, cliente });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/cliente/${deleteModal.cliente.id}`);
      setDeleteModal(initialModalState);
      fetchClientes();
    } catch (error) {
      alert("Error al eliminar cliente");
    }
  };

  const getRoleColor = (rol) => {
    const colors = {
      'Administrador': 'bg-blue-100 text-blue-800',
      'Gerente': 'bg-purple-100 text-purple-800',
      'Cliente Premium': 'bg-amber-100 text-amber-800',
      'Cliente': 'bg-gray-100 text-gray-800'
    };
    return colors[rol] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-800 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
                <p className="text-sm text-gray-500">Administra y supervisa tu cartera de clientes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de búsqueda */}
        <div className="mb-6 flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar clientes por nombre, email o rol..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesPagina.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      No hay clientes registrados.
                    </td>
                  </tr>
                ) : (
                  clientesPagina.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-green-900 mr-2" />
                          <span className="font-medium text-gray-900">{cliente.user_id?.nombre || "Sin nombre"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center text-gray-700 text-sm">
                            <Mail className="h-4 w-4 mr-1" /> {cliente.user_id?.email || "Sin email"}
                          </span>
                          <span className="flex items-center text-gray-700 text-sm">
                            <Phone className="h-4 w-4 mr-1" /> {cliente.user_id?.telefono || "Sin teléfono"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRoleColor(cliente.user_id?.rol)}`}>
                          {Array.isArray(cliente.user_id?.rol)
                            ? cliente.user_id.rol.join(", ")
                            : cliente.user_id?.rol || "Sin rol"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 rounded hover:bg-blue-50 cursor-pointer"
                            onClick={() => handleView(cliente)}
                            title="Ver"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            className="p-2 rounded hover:bg-red-50 cursor-pointer"
                            onClick={() => handleDelete(cliente)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * PAGE_SIZE + 1}
                      </span>
                      {" "}a{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * PAGE_SIZE, filteredClientes.length)}
                      </span>
                      {" "}de{" "}
                      <span className="font-medium">{filteredClientes.length}</span>
                      {" "}clientes
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-l bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {[...Array(totalPages)].map((_, idx) => (
                        <button
                          key={idx}
                          className={`px-3 py-1 ${currentPage === idx + 1
                            ? "bg-blue-700 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            } transition`}
                          onClick={() => setCurrentPage(idx + 1)}
                        >
                          {idx + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-r bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {detailModal.show && (
        <Modal onClose={() => setDetailModal(initialModalState)}>
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalles del Cliente</h2>
              <p className="text-sm text-gray-500">Información completa del cliente</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Nombre completo</label>
              <p className="text-lg font-semibold text-gray-900">{detailModal.cliente.user_id?.nombre || "Sin nombre"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Correo electrónico</label>
              <p className="text-lg font-semibold text-gray-900">{detailModal.cliente.user_id?.email || "Sin email"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Teléfono</label>
              <p className="text-lg font-semibold text-gray-900">{detailModal.cliente.user_id?.telefono || "Sin teléfono"}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Rol</label>
              <p className="text-lg font-semibold text-gray-900">
                {Array.isArray(detailModal.cliente.user_id?.rol)
                  ? detailModal.cliente.user_id.rol.join(", ")
                  : detailModal.cliente.user_id?.rol || "Sin rol"}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {editModal.show && (
        <Modal onClose={() => setEditModal(initialModalState)}>
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
              <Edit3 className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Editar Cliente</h2>
              <p className="text-sm text-gray-500">Actualiza la información del cliente</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editForm.nombre}
                onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editForm.telefono}
                onChange={(e) => setEditForm((f) => ({ ...f, telefono: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editForm.rol}
                onChange={(e) => setEditForm((f) => ({ ...f, rol: e.target.value }))}
              >
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Gerente">Gerente</option>
                <option value="Cliente Premium">Cliente Premium</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors font-medium"
                onClick={handleEditSubmit}
              >
                Guardar cambios
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-medium"
                onClick={() => setEditModal(initialModalState)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteModal.show && (
        <Modal onClose={() => setDeleteModal(initialModalState)}>
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Eliminar Cliente</h2>
              <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              ¿Estás seguro de que deseas eliminar permanentemente el cliente{" "}
              <span className="font-semibold">{deleteModal.cliente.user_id?.nombre || "Sin nombre"}</span>?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors font-medium"
              onClick={confirmDelete}
            >
              Eliminar cliente
            </button>
            <button
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors font-medium"
              onClick={() => setDeleteModal(initialModalState)}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

export default ClientesList;
