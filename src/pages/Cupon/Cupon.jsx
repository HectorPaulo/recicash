import { useEffect, useState } from "react";
                    import axios from "axios";
                    import { useAuth } from "../../contexts/AuthContext.jsx";

                    const initialModalState = { show: false, cupon: null };

                    const Cupon = () => {
                      const [cupones, setCupones] = useState([]);
                      const [detailsModal, setDetailsModal] = useState(initialModalState);
                      const [createModal, setCreateModal] = useState(false);
                      const [editModal, setEditModal] = useState(initialModalState);
                      const [deleteModal, setDeleteModal] = useState(initialModalState);
                      const getTomorrow = () => {
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        return d.toISOString().split('T')[0];
                      }
                      const [form, setForm] = useState({
                        titulo: "",
                        detalles: "",
                        precio: "",
                        cantidad: "",
                        fechaExpiracion: getTomorrow(),
                      });
                      const [formError, setFormError] = useState("");
                      const { currentUser } = useAuth();
                      const empresaId = currentUser?.id || currentUser?.user_id?.id;


                      const fetchCupones = async () => {
                        try {
                          const res = await axios.get(
                            `${import.meta.env.VITE_API_URL}/cupon/empresa/${empresaId}`
                          );
                          setCupones(Array.isArray(res.data.cupones) ? res.data.cupones : []);
                        } catch {
                          setCupones([]);
                        }
                      };

                      const validateForm = () => {
                        if (
                          !form.titulo.trim() ||
                          !form.detalles.trim() ||
                          !form.precio.trim() ||
                          !form.cantidad.trim() ||
                          !form.fechaExpiracion.trim()
                        ) {
                          setFormError("Todos los campos son obligatorios.");
                          return false;
                        }
                        if (form.fechaExpiracion < new Date().toISOString().slice(0, 10)) {
                            setFormError("La fecha de expiración no puede ser anterior a hoy.");
                            return false;
                        }
                        if (Number(form.cantidad) <= 0) {
                          setFormError("La cantidad debe ser mayor a 0.");
                          return false;
                        }
                        setFormError("");
                        return true;
                      };

                      useEffect(() => {
                        if (empresaId) fetchCupones();
                        // eslint-disable-next-line
                      }, [empresaId]);

                      // Progress bar
                      const getProgress = (cupon) => {
                        const total = cupon.cantidadInicial || cupon.cuposTotales || cupon.cantidad + (cupon.cuposOcupados || 0) || 1;
                        const ocupados = total - cupon.cantidad;
                        return Math.min(100, Math.round((ocupados / total) * 100));
                      };

                      // Crear cupón
                      const handleCreate = async (e) => {
                        e.preventDefault();
                        if (!validateForm()) return;
                        try {
                          await axios.post(`${import.meta.env.VITE_API_URL}/cupon`, {
                            ...form,
                            cantidadInicial: form.cantidad,
                            empresa: empresaId,
                          });
                          setCreateModal(false);
                          setForm({
                            titulo: "",
                            detalles: "",
                            precio: "",
                            cantidad: "",
                            fechaExpiracion: "",
                          });
                          fetchCupones();
                        } catch {
                          setFormError("Error al crear cupón");
                        }
                      };

                      // Editar cupón (solo abre el modal y carga datos)
                      const handleEdit = (cupon) => {
                        setForm({
                          titulo: cupon.titulo,
                          detalles: cupon.detalles,
                          precio: cupon.precio,
                          cantidad: cupon.cantidad,
                          fechaExpiracion: cupon.fechaExpiracion?.slice(0, 10),
                        });
                        setEditModal({ show: true, cupon });
                      };

                      const handleEditSubmit = async (e) => {
                        e.preventDefault();
                        if (!validateForm()) return;
                        try {
                          await axios.patch(
                            `${import.meta.env.VITE_API_URL}/cupon/${editModal.cupon.id}`,
                            form
                          );
                          setEditModal(initialModalState);
                          setForm({
                            titulo: "",
                            detalles: "",
                            precio: "",
                            cantidad: "",
                            fechaExpiracion: "",
                          });
                          fetchCupones();
                        } catch {
                          setFormError("Error al editar cupón");
                        }
                      };

                      // Eliminar cupón
                      const handleDelete = (cupon) => {
                        setDeleteModal({ show: true, cupon });
                      };

                      const confirmDelete = async () => {
                        try {
                          await axios.delete(
                            `${import.meta.env.VITE_API_URL}/cupon/${deleteModal.cupon.id}`
                          );
                          setDeleteModal(initialModalState);
                          fetchCupones();
                        } catch {
                          setFormError("Error al eliminar cupón");
                        }
                      };

                      return (
                        <div className="min-h-screen bg-gradient-to-t py-10 px-2">
                          <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-gray-900">Cupones de mi empresa</h2>
                            <button
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium"
                              onClick={() => setCreateModal(true)}
                            >
                              + Crear cupón
                            </button>
                          </div>
                          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {cupones.map((cupon) => (
                              <div
                                key={cupon.id}
                                className="rounded-xl border border-gray-200 p-6 flex flex-col items-center"
                              >
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{cupon.titulo}</h3>
                                <p className="text-lg text-green-700 font-semibold mb-2">${cupon.precio}</p>
                                <div className="w-full mb-2">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>
                                      Cupos: {cupon.cantidad} / {cupon.cantidadInicial || cupon.cuposTotales || cupon.cantidad + (cupon.cuposOcupados || 0)}
                                    </span>
                                    <span>{getProgress(cupon)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                      className="bg-emerald-500 h-3 rounded-full transition-all"
                                      style={{ width: `${getProgress(cupon)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm"
                                    onClick={() => setDetailsModal({ show: true, cupon })}
                                  >
                                    <span className="material-symbols-outlined">Visibility</span>
                                  </button>
                                  <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                                    onClick={() => handleEdit(cupon)}
                                  >
                                    <span className="material-symbols-outlined">Edit</span>
                                  </button>
                                  <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                                    onClick={() => handleDelete(cupon)}
                                  >
                                    <span className="material-symbols-outlined">Delete</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

{/* Modal Crear */}
{createModal && (
  <Modal onClose={() => setCreateModal(false)}>
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">Crear Nuevo Cupón</h3>
        <p className="text-sm text-gray-600 mt-1">Complete los campos para crear un cupón</p>
      </div>

      <form onSubmit={handleCreate} className="px-6 py-4 space-y-5">
        {/* Mensaje de error */}
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {formError}
            </div>
          </div>
        )}

        {/* Título */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Título del Cupón
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            placeholder="Ej: Cartón"
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            required
          />
        </div>

        {/* Detalles */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 resize-none"
            placeholder="Describe los requerimientos del cupón..."
            value={form.detalles}
            onChange={e => setForm({ ...form, detalles: e.target.value })}
            required
          />
        </div>

        {/* Precio y Cantidad */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Remuneración (puntos)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              placeholder="0.00"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cupos
            </label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              placeholder="1"
              value={form.cantidad}
              onChange={e => setForm({ ...form, cantidad: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Fecha de Expiración */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Expiración
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900"
            value={form.fechaExpiracion}
            onChange={e => setForm({ ...form, fechaExpiracion: e.target.value })}
            min={getTomorrow()}
            placeholder={getTomorrow()}
            required
          />
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 text-sm cursor-pointer hover:scale-105 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            onClick={() => setCreateModal(false)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium cursor-pointer hover:scale-105 text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 shadow-sm"
          >
            Crear Cupón
          </button>
        </div>
      </form>
    </div>
  </Modal>
)}

                          {/* Modal Editar */}
                          {editModal.show && (
                            <Modal onClose={() => setEditModal(initialModalState)}>
                              <h3 className="text-2xl font-bold mb-4 text-white">Editar Cupón</h3>
                              <form onSubmit={handleEditSubmit} className="space-y-4">
                                {formError && <div className="text-red-500">{formError}</div>}
                                <input
                                  className="w-full rounded-lg px-3 py-2"
                                  placeholder="Título"
                                  value={form.titulo}
                                  onChange={e => setForm({ ...form, titulo: e.target.value })}
                                  required
                                />
                                <textarea
                                  className="w-full rounded-lg px-3 py-2"
                                  placeholder="Detalles"
                                  value={form.detalles}
                                  onChange={e => setForm({ ...form, detalles: e.target.value })}
                                  required
                                />
                                <input
                                  className="w-full rounded-lg px-3 py-2"
                                  placeholder="Precio"
                                  type="number"
                                  value={form.precio}
                                  onChange={e => setForm({ ...form, precio: e.target.value })}
                                  required
                                />
                                <input
                                  className="w-full rounded-lg px-3 py-2"
                                  placeholder="Cantidad"
                                  type="number"
                                  value={form.cantidad}
                                  onChange={e => setForm({ ...form, cantidad: e.target.value })}
                                  required
                                />
                                <input
                                  className="w-full rounded-lg px-3 py-2"
                                  placeholder="Fecha de expiración"
                                  type="date"
                                  value={form.fechaExpiracion}
                                  onChange={e => setForm({ ...form, fechaExpiracion: e.target.value })}
                                  required
                                />
                                <div className="flex gap-4 mt-4">
                                  <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    type="button"
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium"
                                    onClick={() => setEditModal(initialModalState)}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            </Modal>
                          )}

                          {/* Modal Eliminar */}
                          {deleteModal.show && (
                            <Modal onClose={() => setDeleteModal(initialModalState)}>
                              <h3 className="text-2xl font-bold mb-4 text-white">Eliminar Cupón</h3>
                              <p className="mb-6 text-white">¿Estás seguro de que deseas eliminar este cupón?</p>
                              <div className="flex gap-4">
                                <button
                                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                                  onClick={confirmDelete}
                                >
                                  Eliminar
                                </button>
                                <button
                                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium"
                                  onClick={() => setDeleteModal(initialModalState)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </Modal>
                          )}

                          {/* Modal de detalles */}
                          {detailsModal.show && (
                            <Modal onClose={() => setDetailsModal(initialModalState)}>
                              <h3 className="text-2xl font-bold mb-4 text-white">{detailsModal.cupon.titulo}</h3>
                              <div className="text-white space-y-2">
                                <p><span className="font-semibold">Precio:</span> ${detailsModal.cupon.precio}</p>
                                <p><span className="font-semibold">Cupos totales:</span> {detailsModal.cupon.cantidad}</p>
                                <p><span className="font-semibold">Cupos disponibles:</span> {detailsModal.cupon.cantidad - (detailsModal.cupon.cuposOcupados || 0)}</p>
                                <p><span className="font-semibold">Detalles:</span> {detailsModal.cupon.detalles}</p>
                                <p><span className="font-semibold">Expira:</span> {new Date(detailsModal.cupon.fechaExpiracion).toLocaleDateString()}</p>
                              </div>
                            </Modal>
                          )}
                        </div>
                      );
                    };

                    function Modal({ children }) {
                      return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                            {children}
                        </div>
                      );
                    }

                    export default Cupon;