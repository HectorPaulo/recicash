import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Building, MapPin, User, Eye, Edit3, Trash2, Plus, ChevronLeft, ChevronRight, X, Search, Filter } from "lucide-react";

const PAGE_SIZE = 8;
const initialModalState = { show: false, empresa: null };
const initialUserModalState = { show: false, user: null };

const Empresas = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailModal, setDetailModal] = useState(initialModalState);
  const [editModal, setEditModal] = useState(initialModalState);
  const [deleteModal, setDeleteModal] = useState(initialModalState);
  const [userModal, setUserModal] = useState(initialUserModalState);
  const [editForm, setEditForm] = useState({ empresa: "", ubicacion: "" });
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/empresa");
      setEmpresas(Array.isArray(res.data) ? res.data : res.data.empresas || []);
      setCurrentPage(1);
    } catch {
      setEmpresas([]);
    }
  };

  // Filtrar empresas por término de búsqueda
  const filteredEmpresas = empresas.filter(empresa =>
      empresa.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.user_id?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // KPIs
  const totalEmpresas = filteredEmpresas.length;
  const ubicacionesUnicas = [...new Set(filteredEmpresas.map(e => e.ubicacion))].length;
  const responsablesAsignados = filteredEmpresas.filter(e => e.user_id).length;

  // Paginación
  const totalPages = Math.ceil(filteredEmpresas.length / PAGE_SIZE);
  const empresasPagina = filteredEmpresas.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
  );

  // Acciones
  const handleView = (empresa) => setDetailModal({ show: true, empresa });
  const handleViewUser = (user) => setUserModal({ show: true, user });
  const handleEdit = (empresa) => {
    setEditForm({
      empresa: empresa.empresa,
      ubicacion: empresa.ubicacion,
    });
    setEditModal({ show: true, empresa });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
          `${import.meta.env.VITE_API_URL}/empresa/${editModal.empresa.id}`,
          {
            empresa: editForm.empresa,
            ubicacion: editForm.ubicacion,
          }
      );
      setEditModal(initialModalState);
      fetchEmpresas();
    } catch {
      alert("Error al editar empresa");
    }
  };
  const handleDelete = (empresa) => setDeleteModal({ show: true, empresa });
  const confirmDelete = async () => {
    try {
      await axios.delete(
          `${import.meta.env.VITE_API_URL}/empresa/${deleteModal.empresa.id}`
      );
      setDeleteModal(initialModalState);
      fetchEmpresas();
    } catch {
      alert("Error al eliminar empresa");
    }
  };

  return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-700 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
                  <p className="text-sm text-gray-500">Administra y supervisa tu cartera de empresas</p>
                </div>
              </div>
              <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  onClick={() => navigate("/registrar-empresa")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Empresa
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 flex items-center">
                <Building className="h-10 w-10 text-green-700 mr-4" />
                <div>
                  <dt className="text-sm font-medium text-gray-500 truncate">Empresas totales</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalEmpresas}</dd>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 flex items-center">
                <MapPin className="h-10 w-10 text-green-700 mr-4" />
                <div>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ubicaciones únicas</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{ubicacionesUnicas}</dd>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 flex items-center">
                <User className="h-10 w-10 text-green-700 mr-4" />
                <div>
                  <dt className="text-sm font-medium text-gray-500 truncate">Responsables asignados</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{responsablesAsignados}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {empresasPagina.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-400">
                        No hay empresas para mostrar.
                      </td>
                    </tr>
                ) : (
                    empresasPagina.map((empresa) => (
                        <tr key={empresa.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Building className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-medium text-gray-900">{empresa.empresa}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              {empresa.ubicacion}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {empresa.user_id ? (
                                <button
                                    className="flex items-center text-green-700 hover:text-green-900 transition-colors"
                                    onClick={() => handleViewUser(empresa.user_id)}
                                >
                                  <User className="h-4 w-4 mr-1" />
                                  {empresa.user_id.nombre}
                                </button>
                            ) : (
                                <span className="text-gray-400">Sin responsable</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                  className="p-2 rounded hover:bg-blue-50 transition-colors"
                                  onClick={() => handleView(empresa)}
                                  title="Ver"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </button>
                              <button
                                  className="p-2 rounded hover:bg-amber-50 transition-colors"
                                  onClick={() => handleEdit(empresa)}
                                  title="Editar"
                              >
                                <Edit3 className="h-4 w-4 text-amber-600" />
                              </button>
                              <button
                                  className="p-2 rounded hover:bg-red-50 transition-colors"
                                  onClick={() => handleDelete(empresa)}
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
                        {Math.min(currentPage * PAGE_SIZE, filteredEmpresas.length)}
                      </span>
                          {" "}de{" "}
                          <span className="font-medium">{filteredEmpresas.length}</span>
                          {" "}empresas
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
                                  className={`px-3 py-1 ${
                                      currentPage === idx + 1
                                          ? "bg-green-700 text-white"
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
                <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Building className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Detalles de la Empresa</h2>
                  <p className="text-sm text-gray-500">Información completa de la empresa</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500">Nombre de la empresa</label>
                  <p className="text-lg font-semibold text-gray-900">{detailModal.empresa.empresa}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500">Ubicación</label>
                  <p className="text-lg font-semibold text-gray-900">{detailModal.empresa.ubicacion}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500">Responsable</label>
                  {detailModal.empresa.user_id ? (
                      <div className="mt-2">
                        <button
                            className="flex items-center text-green-700 hover:text-green-900 transition-colors"
                            onClick={() => handleViewUser(detailModal.empresa.user_id)}
                        >
                          <User className="h-5 w-5 mr-2" />
                          <div>
                            <p className="text-lg font-semibold">{detailModal.empresa.user_id.nombre}</p>
                            <p className="text-sm text-gray-600">{detailModal.empresa.user_id.email}</p>
                          </div>
                        </button>
                      </div>
                  ) : (
                      <p className="text-gray-400">No asignado</p>
                  )}
                </div>
              </div>
            </Modal>
        )}

        {userModal.show && (
            <Modal onClose={() => setUserModal(initialUserModalState)}>
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Detalles del Responsable</h2>
                  <p className="text-sm text-gray-500">Información del contacto asignado</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500">Nombre completo</label>
                  <p className="text-lg font-semibold text-gray-900">{userModal.user?.nombre}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500">Correo electrónico</label>
                  <p className="text-lg font-semibold text-gray-900">{userModal.user?.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-lg font-semibold text-gray-900">{userModal.user?.telefono || "No especificado"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-500">Rol</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {Array.isArray(userModal.user?.rol)
                        ? userModal.user.rol.join(", ")
                        : userModal.user?.rol}
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
                  <h2 className="text-xl font-bold text-gray-900">Editar Empresa</h2>
                  <p className="text-sm text-gray-500">Actualiza la información de la empresa</p>
                </div>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa</label>
                  <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.empresa}
                      onChange={(e) => setEditForm({ ...editForm, empresa: e.target.value })}
                      required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.ubicacion}
                      onChange={(e) => setEditForm({ ...editForm, ubicacion: e.target.value })}
                      required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                      type="submit"
                      className="flex-1 bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors font-medium"
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
              </form>
            </Modal>
        )}

        {deleteModal.show && (
            <Modal onClose={() => setDeleteModal(initialModalState)}>
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Eliminar Empresa</h2>
                  <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">
                  ¿Estás seguro de que deseas eliminar permanentemente la empresa{" "}
                  <span className="font-semibold">{deleteModal.empresa.empresa}</span>?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors font-medium"
                    onClick={confirmDelete}
                >
                  Eliminar empresa
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

export default Empresas;