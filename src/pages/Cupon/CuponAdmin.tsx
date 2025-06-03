import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
const PAGE_SIZE = 9;

const initialModalState = { show: false, cupon: null };

const CuponAdmin = () => {
  const { isAdmin } = useAuth();
  const [cupones, setCupones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailsModal, setDetailsModal] = useState(initialModalState);
  const [editModal, setEditModal] = useState(initialModalState);
  const [deleteModal, setDeleteModal] = useState(initialModalState);
  const [participantsModal, setParticipantsModal] = useState({ show: false, cupon: null, participantes: [] });
  const [form, setForm] = useState({
    titulo: "",
    detalles: "",
    precio: "",
    cantidad: "",
    fechaExpiracion: "",
  });

  const API_URL = "https://proyectodesarrollo-94d5.onrender.com/api";

  const fetchCupones = async () => {
    try {
      const res = await axios.get(`${API_URL}/cupon`);
      if (Array.isArray(res.data)) {
        setCupones(res.data);
      } else if (Array.isArray(res.data.cupones)) {
        setCupones(res.data.cupones);
      } else {
        setCupones([]);
      }
      setCurrentPage(1);
    } catch {
      setCupones([]);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchCupones();
    // eslint-disable-next-line
  }, [isAdmin]);

  // Paginación
  const totalPages = Math.ceil(cupones.length / PAGE_SIZE);
  const cuponesPagina = cupones.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
        `${API_URL}/cupon/${editModal.cupon.id}`,
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
      await fetchCupones();
    } catch {
      alert("Error al editar cupón");
    }
  };

  // Eliminar cupón
  const handleDelete = (cupon) => setDeleteModal({ show: true, cupon });
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/cupon/${deleteModal.cupon.id}`
      );
      setDeleteModal(initialModalState);
      await fetchCupones();
      // Si la página actual queda vacía y hay páginas previas, retrocede una página
      if (
        (currentPage - 1) * PAGE_SIZE >= cupones.length - 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      }
    } catch {
      alert("Error al eliminar cupón");
    }
  };

  const getProgress = (cupon) => {
    const total = cupon.cantidadInicial || cupon.cuposTotales || cupon.cantidad + (cupon.cuposOcupados || 0) || 1;
    const ocupados = total - cupon.cantidad;
    return Math.min(100, Math.round((ocupados / total) * 100));
  };

  // Obtener nombre de empresa seguro
  const getEmpresaNombre = (empresa) => {
    if (!empresa) return "";
    if (typeof empresa === "string") return empresa;
    return empresa.nombre || empresa.empresa || "";
  };

  // Obtener participantes de un cupón
  const fetchParticipantes = async (cuponId) => {
    try {
      const res = await axios.get(`${API_URL}/cupon/${cuponId}/participantes`);
      setParticipantsModal({ show: true, cupon: cuponId, participantes: res.data || [] });
    } catch {
      setParticipantsModal({ show: true, cupon: cuponId, participantes: [] });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-t py-10 px-2">
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Cupones registrados por las empresas</h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cuponesPagina.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12">
            No hay cupones registrados.
          </div>
        ) : (
          cuponesPagina.map((cupon) => (
            <div
              key={cupon.id}
              className="rounded-xl border border-gray-200 p-6 flex flex-col items-center bg-white shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{cupon.titulo}</h3>
              <p className="text-lg text-green-700 font-semibold mb-2">${cupon.precio}</p>
              <div className="text-sm text-gray-500 mb-1">
                Empresa: <span className="font-semibold text-emerald-700">{getEmpresaNombre(cupon.empresa)}</span>
              </div>
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
                  title="Ver detalles"
                >
                  <span className="material-symbols-outlined">Visibility</span>
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                  onClick={() => handleEdit(cupon)}
                  title="Editar"
                >
                  <span className="material-symbols-outlined">Edit</span>
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  onClick={() => handleDelete(cupon)}
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined">Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-8 justify-center">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded ${
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
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}

      {/* Modal Detalles */}
      {detailsModal.show && (
        <Modal onClose={() => setDetailsModal(initialModalState)}>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">{detailsModal.cupon.titulo}</h3>
          <div className="text-gray-900 space-y-2">
            <p>
              <span className="font-semibold">Empresa:</span> {getEmpresaNombre(detailsModal.cupon.empresa)}
            </p>
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

      {/* Modal Participantes */}
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex justify-end">
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => setParticipantsModal({ show: false, cupon: null, participantes: [] })}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal Editar */}
      {editModal.show && (
        <Modal onClose={() => setEditModal(initialModalState)}>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Editar Cupón</h3>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-gray-900">
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

export default CuponAdmin;
