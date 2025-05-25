import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import axios from "axios";

const initialModalState = { show: false, cupon: null };

const Cupon = () => {
  const [cupones, setCupones] = useState([]);
  const [selected, setSelected] = useState(null);
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

  useEffect(() => {
    fetchCupones();
  }, []);

  const fetchCupones = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cupon`);
      setCupones(res.data);
    } catch {
      setCupones([]);
    }
  };

  // Crear cupón
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/cupon`, form);
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
      fechaExpiracion: cupon.fechaExpiracion,
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
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-[#6A994E] to-[#A7C957]">
      <div className="flex flex-1 p-6 gap-6">
        <Sidebar />
        <div className="flex flex-col items-center min-w-2/3 justify-start min-h-screen w-full">
          <h1 className="text-6xl text-white font-black mb-4">Cupones</h1>
          {/* Botón crear cupón */}
          <div className="w-full flex justify-end mt-8 max-w-6xl">
            <button
              className="bg-green-800 hover:scale-105 hover:animate-pulse hover:bg-green-950 cursor-pointer px-4 py-2 rounded font-black text-white flex items-center gap-2"
              onClick={() => setCreateModal(true)}
            >
              Crear cupón
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          {/* Cards de cupones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mt-12">
            {cupones.map((cupon) => (
              <div
                key={cupon.id}
                className={`rounded-2xl shadow-xl bg-green-900/40 border-2 border-green-800 p-6 flex flex-col gap-2 relative transition-all ${
                  selected?.id === cupon.id ? "ring-4 ring-green-400" : ""
                }`}
                onClick={() => setSelected(cupon)}
              >
                <h2 className="text-2xl font-black text-white mb-2">
                  {cupon.titulo}
                </h2>
                <p className="text-white mb-1">{cupon.detalles}</p>
                <div className="flex flex-wrap gap-2 text-white text-lg font-bold">
                  <span>
                    Precio: <span className="font-mono">${cupon.precio}</span>
                  </span>
                  <span>
                    Cantidad:{" "}
                    <span className="font-mono">{cupon.cantidad}</span>
                  </span>
                </div>
                <div className="text-white text-sm mt-2">
                  Expira:{" "}
                  <span className="font-mono">{cupon.fechaExpiracion}</span>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    className="cursor-pointer hover:scale-105 hover:animate-pulse text-yellow-200 px-2 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(cupon);
                    }}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    className="cursor-pointer hover:scale-105 hover:animate-pulse text-red-300 px-2 py-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(cupon);
                    }}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>


          {/* Modal Crear */}
          {createModal && (
            <Modal onClose={() => setCreateModal(false)}>
              <h2 className="text-3xl font-black text-white mb-2 text-center">
                Crear cupón
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Título"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="text"
                  name="detalles"
                  value={form.detalles}
                  onChange={(e) =>
                    setForm({ ...form, detalles: e.target.value })
                  }
                  placeholder="Detalles"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  placeholder="Precio"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="number"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={(e) =>
                    setForm({ ...form, cantidad: e.target.value })
                  }
                  placeholder="Cantidad"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="date"
                  name="fechaExpiracion"
                  value={form.fechaExpiracion}
                  onChange={(e) =>
                    setForm({ ...form, fechaExpiracion: e.target.value })
                  }
                  placeholder="Fecha de expiración"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-800 text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 hover:animate-pulse font-black "
                  >
                    Crear
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded-xl font-bold cursor-pointer hover:scale-105 hover:animate-pulse text-green-900"
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
              <h2 className="text-3xl font-black text-white mb-2 text-center">
                Editar cupón
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Título"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="text"
                  name="detalles"
                  value={form.detalles}
                  onChange={(e) =>
                    setForm({ ...form, detalles: e.target.value })
                  }
                  placeholder="Detalles"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="number"
                  name="precio"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  placeholder="Precio"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="number"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={(e) =>
                    setForm({ ...form, cantidad: e.target.value })
                  }
                  placeholder="Cantidad"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="date"
                  name="fechaExpiracion"
                  value={form.fechaExpiracion}
                  onChange={(e) =>
                    setForm({ ...form, fechaExpiracion: e.target.value })
                  }
                  placeholder="Fecha de expiración"
                  className="border-b-2 p-2 w-full border-green-800 bg-transparent text-white"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-green-800 text-white px-4 py-2 rounded-xl cursor-pointer hover:scale-105 hover:animate-pulse font-black "
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded-xl font-bold cursor-pointer hover:scale-105 hover:animate-pulse text-green-900"
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
              <h2 className="text-xl font-black mb-4 text-white">
                ¿Eliminar cupón "{deleteModal.cupon.titulo}"?
              </h2>
              <div className="flex gap-2 items-end justify-center h-50">
                <button
                  className="bg-red-600 cursor-pointer hover:scale-105 hover:animate-pulse text-white px-4 py-2 rounded"
                  onClick={confirmDelete}
                >
                  Eliminar
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:scale-105 hover:animate-pulse text-green-900"
                  onClick={() => setDeleteModal(initialModalState)}
                >
                  Cancelar
                </button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ">
      <div className="bg-green-900/90 rounded-xl p-6 min-w-[420px] min-h-[420px] relative border-b-8 border-l-8 border-r-2 border-t-2 border-green-800">
        {children}
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Cupon;
