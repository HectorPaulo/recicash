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
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Crear cupón
        </button>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cupones.map((cupon) => (
          <div
            key={cupon.id}
            className="rounded-xl border border-gray-200 p-6 flex flex-col items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm cursor-pointer flex items-center"
                onClick={() => setDetailsModal({ show: true, cupon })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                Ver
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer flex items-center"
                onClick={() => handleEdit(cupon)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Editar
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer flex items-center"
                onClick={() => handleDelete(cupon)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear */}
      {createModal && (
        <Modal onClose={() => setCreateModal(false)} title="Crear Nuevo Cupón" subtitle="Complete los campos para crear un cupón">
          <form onSubmit={handleCreate} className="space-y-5">
            {/* Mensaje de error */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 resize-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900"
                value={form.fechaExpiracion}
                onChange={e => setForm({ ...form, fechaExpiracion: e.target.value })}
                min={getTomorrow()}
                placeholder={getTomorrow()}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                onClick={() => setCreateModal(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium cursor-pointer text-white bg-emerald-600 border border-transparent rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 shadow-sm"
              >
                Crear Cupón
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Editar */}
      {editModal.show && (
        <Modal onClose={() => setEditModal(initialModalState)} title="Editar Cupón" subtitle="Actualiza la información del cupón">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Título"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 resize-none"
                placeholder="Detalles"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Precio"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Cantidad"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-gray-900"
                placeholder="Fecha de expiración"
                value={form.fechaExpiracion}
                onChange={e => setForm({ ...form, fechaExpiracion: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 cursor-pointer"
                onClick={() => setEditModal(initialModalState)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Eliminar */}
      {deleteModal.show && (
        <Modal onClose={() => setDeleteModal(initialModalState)} title="Eliminar Cupón" icon="warning">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">¿Estás seguro de eliminar este cupón?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Esta acción no se puede deshacer. El cupón será eliminado permanentemente.
            </p>
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 cursor-pointer"
              onClick={() => setDeleteModal(initialModalState)}
              disabled={loadingDelete}
            >
              Cancelar
            </button>
            <button
              className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 shadow-sm cursor-pointer disabled:opacity-60"
              onClick={confirmDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Eliminando...
                </>
              ) : (
                'Eliminar Cupón'
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de detalles */}
      {detailsModal.show && (
        <Modal onClose={() => setDetailsModal(initialModalState)} title={detailsModal.cupon.titulo} subtitle="Detalles del cupón">
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-sm font-medium text-emerald-900">Remuneración</span>
              <span className="text-lg font-semibold text-emerald-700">{detailsModal.cupon.precio} puntos</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div>
                <span className="text-sm font-medium text-blue-900 block">Cupos</span>
                <span className="text-xs text-blue-700">{detailsModal.cupon.cantidadInicial || 0} totales</span>
              </div>
              <span className="text-lg font-semibold text-blue-700">{detailsModal.cupon.cantidad} disponibles</span>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-sm font-medium text-gray-700 block mb-2">Detalles</span>
              <p className="text-gray-900">{detailsModal.cupon.detalles}</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
              <span className="text-sm font-medium text-amber-900">Fecha de Expiración</span>
              <span className="font-semibold text-amber-700">
                {new Date(detailsModal.cupon.fechaExpiracion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Ocupación</span>
                <span className="text-sm font-medium text-gray-700">{getProgress(detailsModal.cupon)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all"
                  style={{ width: `${getProgress(detailsModal.cupon)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm cursor-pointer flex items-center"
              onClick={() => fetchParticipantes(detailsModal.cupon.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Ver participantes
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de participantes */}
      {participantsModal.show && (
        <Modal onClose={() => setParticipantsModal({ show: false, cupon: null, participantes: [] })} title="Participantes del cupón" subtitle="Gestione los participantes del cupón">
          {participantsModal.participantes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No hay participantes registrados</p>
              <p className="text-gray-500 text-sm mt-1">Este cupón aún no tiene participantes.</p>
            </div>
          ) : (
            <div className="mt-4 overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participantsModal.participantes.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{p.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{p.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.autorizado ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                            Autorizado
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!p.autorizado && (
                          <button
                            className="text-emerald-600 hover:text-emerald-900 font-medium flex items-center disabled:opacity-50 cursor-pointer border border-emerald-200 rounded-md px-3 py-1 hover:bg-emerald-50"
                            onClick={() => autorizarParticipacion(p)}
                            disabled={loadingAutorizar[p.id]}
                          >
                            {loadingAutorizar[p.id] ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Autorizando...
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Autorizar
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 cursor-pointer"
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

function Modal({ children, onClose, title, subtitle, icon }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay de fondo con transición */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Centrado del modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Modal con animación y diseño mejorado */}
        <div 
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-modal"
          style={{animationDuration: '0.3s'}}
        >
          {/* Cabecera del modal con degradado suave */}
          {title && (
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">
                      {subtitle}
                    </p>
                  )}
                </div>
                
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
                  onClick={onClose}
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Contenido del modal con padding más amplio */}
          <div className="p-6 text-gray-900">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cupon;
