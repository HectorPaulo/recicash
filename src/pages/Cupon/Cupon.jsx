import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../contexts/AuthContext.jsx";

const initialModalState = { show: false, cupon: null };

const Cupon = () => {
  const [cupones, setCupones] = useState([]);
  const [detailsModal, setDetailsModal] = useState(initialModalState);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(initialModalState);
  const [deleteModal, setDeleteModal] = useState(initialModalState);
  const [participantsModal, setParticipantsModal] = useState({ show: false, cupon: null, participantes: [] });
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingAutorizar, setLoadingAutorizar] = useState({});
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
    setLoadingDelete(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cupon/${deleteModal.cupon.id}`
      );
      setDeleteModal(initialModalState);
      fetchCupones();
      Swal.fire({
        icon: "success",
        title: "Cupón eliminado",
        text: "El cupón fue eliminado correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      setFormError("Error al eliminar cupón");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el cupón.",
      });
    }
    setLoadingDelete(false);
  };

  // Obtener participantes de un cupón desde el array personas del cupón y hacer join con clientes
  const fetchParticipantes = async (cuponId) => {
    try {
      // Trae todos los cupones y busca el que corresponde
      const resCupones = await axios.get(`${import.meta.env.VITE_API_URL}/cupon`);
      const cupones = Array.isArray(resCupones.data) ? resCupones.data : [];
      const cupon = cupones.find(c => c.id === cuponId);
      const personasIds = cupon?.personas || [];

      // Trae todos los clientes
      const resClientes = await axios.get(`${import.meta.env.VITE_API_URL}/cliente`);
      const clientes = Array.isArray(resClientes.data) ? resClientes.data : [];

      // Haz join: busca los datos de cada persona por id, user_id, o user_id.id
      const participantes = personasIds.map(pid => {
        // Busca por id, _id, user_id, user_id.id, user_id._id
        const cliente = clientes.find(
          c =>
            c.id === pid ||
            c._id === pid ||
            c.user_id === pid ||
            (typeof c.user_id === "object" && (c.user_id.id === pid || c.user_id._id === pid)) ||
            c.user_id === pid
        );
        return {
          id: pid,
          nombre: cliente?.nombre || cliente?.user_id?.nombre || "Sin nombre",
          email: cliente?.email || cliente?.user_id?.email || "Sin email",
          autorizado: cliente?.autorizado, // si tienes este campo, si no, puedes omitirlo
          puntos: cupon?.precio || 0
        };
      });

      setParticipantsModal({
        show: true,
        cupon: cuponId,
        participantes
      });
    } catch {
      setParticipantsModal({ show: true, cupon: cuponId, participantes: [] });
    }
  };

  // Autorizar participación (asignar puntos)
  const autorizarParticipacion = async (participante) => {
    setLoadingAutorizar((prev) => ({ ...prev, [participante.id]: true }));
    try {
      const token = localStorage.getItem("recicash_token");
      // El backend espera que el campo puntos sea un número entero y que el cliente exista
      // Además, asegúrate de que el ID sea el del cliente, no el del usuario
      // Y que el valor de puntos sea positivo y no string vacío
      const puntos = Number(participante.puntos);
      if (!participante.id || isNaN(puntos) || puntos <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Datos inválidos",
          text: "No se puede autorizar: ID o puntos inválidos.",
        });
        setLoadingAutorizar((prev) => ({ ...prev, [participante.id]: false }));
        return;
      }
      console.log(`Autorizando participación de ${participante.nombre} con ID ${participante.id} y puntos ${puntos}`);
      await axios.patch(
        `https://proyectodesarrollo-94d5.onrender.com/api/cliente/${participante.id}/puntos`,
        { puntos },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setParticipantsModal((prev) => ({
        ...prev,
        participantes: prev.participantes.map(p =>
          p.id === participante.id ? { ...p, autorizado: true } : p
        )
      }));
      Swal.fire({
        icon: "success",
        title: "Participación autorizada",
        text: "El cliente ha sido autorizado y se le han asignado los puntos.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      // Muestra el mensaje de error del backend si existe
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          "No se pudo autorizar la participación. Verifica que el cliente exista y que el backend acepte el formato.",
      });
    }
    setLoadingAutorizar((prev) => ({ ...prev, [participante.id]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-t py-10 px-2">
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Cupones de mi empresa</h2>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium"
          onClick={() => {
            setForm({
              titulo: "",
              detalles: "",
              precio: "",
              cantidad: "",
              fechaExpiracion: getTomorrow(),
            });
            setFormError("");
            setCreateModal(true);
          }}
        >
          + Crear cupón
        </button>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cupones.map((cupon) => (
          <div
            key={cupon.id}
            className="rounded-xl border border-gray-200 p-6 flex flex-col items-center bg-white"
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm cursor-pointer"
                onClick={() => setDetailsModal({ show: true, cupon })}
              >
                <span className="material-symbols-outlined">Visibility</span>
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer"
                onClick={() => handleEdit(cupon)}
              >
                <span className="material-symbols-outlined">Edit</span>
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto text-gray-900">
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
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Editar Cupón</h3>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-gray-900">
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
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Eliminar Cupón</h3>
          <p className="mb-6 text-gray-900">¿Estás seguro de que deseas eliminar este cupón?</p>
          <div className="flex gap-4">
            <button
              className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer ${loadingDelete ? "opacity-60" : ""}`}
              onClick={confirmDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Eliminando..." : "Eliminar"}
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
              onClick={() => setDeleteModal(initialModalState)}
              disabled={loadingDelete}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de detalles */}
      {detailsModal.show && (
        <Modal onClose={() => setDetailsModal(initialModalState)}>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">{detailsModal.cupon.titulo}</h3>
          <div className="text-gray-900 space-y-2">
            <p><span className="font-semibold">Precio:</span> ${detailsModal.cupon.precio}</p>
            <p><span className="font-semibold">Cupos totales:</span> {detailsModal.cupon.cantidad}</p>
            <p><span className="font-semibold">Cupos disponibles:</span> {detailsModal.cupon.cantidad - (detailsModal.cupon.cuposOcupados || 0)}</p>
            <p><span className="font-semibold">Detalles:</span> {detailsModal.cupon.detalles}</p>
            <p><span className="font-semibold">Expira:</span> {new Date(detailsModal.cupon.fechaExpiracion).toLocaleDateString()}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => fetchParticipantes(detailsModal.cupon.id)}
            >
              Ver participantes
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de participantes */}
      {participantsModal.show && (
        <Modal onClose={() => setParticipantsModal({ show: false, cupon: null, participantes: [] })}>
          <h3 className="text-xl font-bold mb-4 text-gray-900">Participantes del cupón</h3>
          {participantsModal.participantes.length === 0 ? (
            <div className="text-gray-500">No hay participantes.</div>
          ) : (
            <table className="min-w-full text-gray-900 mb-4">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Nombre</th>
                  <th className="px-2 py-1 text-left">Email</th>
                  <th className="px-2 py-1 text-left">Autorizado</th>
                  <th className="px-2 py-1 text-left">Acción</th>
                </tr>
              </thead>
              <tbody>
                {participantsModal.participantes.map((p) => (
                  <tr key={p.id}>
                    <td className="px-2 py-1">{p.nombre}</td>
                    <td className="px-2 py-1">{p.email}</td>
                    <td className="px-2 py-1">
                      {p.autorizado ? (
                        <span className="text-green-600 font-semibold">Sí</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">No</span>
                      )}
                    </td>
                    <td className="px-2 py-1">
                      {!p.autorizado && (
                        <button
                          className={`bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm cursor-pointer ${loadingAutorizar[p.id] ? "opacity-60" : ""}`}
                          onClick={() => autorizarParticipacion(p)}
                          disabled={loadingAutorizar[p.id]}
                        >
                          {loadingAutorizar[p.id] ? "Autorizando..." : "Autorizar"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex justify-end">
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
              onClick={() => setParticipantsModal({ show: false, cupon: null, participantes: [] })}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto p-6 relative border-b-8 border-l-8 border-r-2 border-t-2 border-emerald-600 animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-emerald-600 text-2xl font-bold transition"
          onClick={onClose}
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default Cupon;
