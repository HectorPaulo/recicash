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
                    const [form, setForm] = useState({
                      titulo: "",
                      detalles: "",
                      precio: "",
                      cantidad: "",
                      fechaExpiracion: "",
                    });
                    const { currentUser } = useAuth();
                    const empresaId = currentUser?.id || currentUser?.user_id?.id;

                    const fetchCupones = async () => {
                      try {
                        const res = await axios.get(
                          `${import.meta.env.VITE_API_URL}/cupon/empresa/${empresaId}`
                        );
                        setCupones(Array.isArray(res.data.cupones) ? res.data.cupones : []);
                      } catch (error) {
                        setCupones([]);
                      }
                    };

                    useEffect(() => {
                      if (empresaId) fetchCupones();
                      // eslint-disable-next-line
                    }, [empresaId]);

                    // Progress bar
                    const getProgress = (cupon) => {
                      const total = cupon.cantidad || 1;
                      const ocupados = cupon.cuposOcupados || 0;
                      return Math.min(100, Math.round(((total - ocupados) / total) * 100));
                    };

                    // Crear cupón
                    const handleCreate = async (e) => {
                      e.preventDefault();
                      try {
                        await axios.post(`${import.meta.env.VITE_API_URL}/cupon`, {
                          ...form,
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
                      } catch (error) {
                        alert("Error al crear cupón");
                      }
                    };

                    // Editar cupón
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
                        alert("Error al editar cupón");
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
                        alert("Error al eliminar cupón");
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
                                  <span>Cupos: {cupon.cantidad - (cupon.cuposOcupados || 0)} / {cupon.cantidad}</span>
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
                            <h3 className="text-2xl font-bold mb-4 text-white">Crear Cupón</h3>
                            <form onSubmit={handleCreate} className="space-y-4">
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
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                  Crear
                                </button>
                                <button
                                  type="button"
                                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium"
                                  onClick={() => setCreateModal(false)}
                                >
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          </Modal>
                        )}

                        {/* Modal Editar */}
                        {editModal.show && (
                          <Modal onClose={() => setEditModal(initialModalState)}>
                            <h3 className="text-2xl font-bold mb-4 text-white">Editar Cupón</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
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

                  function Modal({ children, onClose }) {
                    return (
                      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                        <div className="bg-green-900/90 rounded-xl p-8 min-w-[350px] min-h-[200px] relative border-b-8 border-l-8 border-r-2 border-t-2 border-green-800 shadow-2xl">
                          <button
                            className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-gray-200"
                            onClick={onClose}
                          >
                            ×
                          </button>
                          {children}
                        </div>
                      </div>
                    );
                  }

                  export default Cupon;