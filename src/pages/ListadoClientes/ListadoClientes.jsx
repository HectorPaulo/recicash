/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Link } from "react-router-dom";

const initialModalState = {
  show: false,
  cliente: null,
};

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [selected, setSelected] = useState(null);
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
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await axios.get(
        "https://proyectodesarrollo-94d5.onrender.com/api/cliente"
      );
      setClientes(res.data.clientes || res.data);
    } catch {
      setClientes([]);
    }
  };

  // Ver detalles
  const handleView = (cliente) => {
    setDetailModal({ show: true, cliente });
  };

  // Editar
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `https://proyectodesarrollo-94d5.onrender.com/api/cliente/${editModal.cliente.id}`,
        {
          nombre: editForm.nombre,
          email: editForm.email,
          telefono: editForm.telefono,
          rol: editForm.rol,
        }
      );
      setEditModal(initialModalState);
      fetchClientes();
    } catch (error) {
      alert("Error al editar cliente");
    }
  };

  // Eliminar
  const handleDelete = (cliente) => {
    setDeleteModal({ show: true, cliente });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://proyectodesarrollo-94d5.onrender.com/api/cliente/${deleteModal.cliente.id}`
      );
      setDeleteModal(initialModalState);
      fetchClientes();
    } catch (error) {
      alert("Error al eliminar cliente");
    }
  };

  return (
    <div className="min h-screen flex flex-col pt-15 bg-gradient-to-t from-[#6A994E] to-[#A7C957]">
      <div className="flex flex-1 p-6 gap-6">
        <Sidebar />

        <div className="flex flex-col items-center min-w-2/3 justify-start min-h-screen">
          <h1 className="text-6xl text-white font-black mb-4">
            Listado de Clientes
          </h1>
          <div className="overflow-x-auto w-full max-w-3xl">
            <table className="min-w-full mt-20">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-4 text-white font-black text-xl">
                    Nombre
                  </th>
                  <th className="py-2 px-4 border-b-4 text-white font-black text-xl">
                    Email
                  </th>
                  <th className="py-2 px-4 border-b-4 text-white font-black text-xl">
                    Teléfono
                  </th>
                  <th className="py-2 px-4 border-b-4 text-white font-black text-xl">
                    Rol
                  </th>
                  <th className="py-2 px-4 border-b-4 text-white font-black text-xl">
                    #
                  </th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className={`text-center ${
                      selected?.id === cliente.id ? "bg-green-100" : ""
                    }`}
                    onClick={() => setSelected(cliente)}
                  >
                    <td className="py-2 px-4 text-white font-semibold">
                      {cliente.user_id?.nombre || "-"}
                    </td>
                    <td className="py-2 px-4 text-white font-semibold">
                      {cliente.user_id?.email || "-"}
                    </td>
                    <td className="py-2 px-4 text-white font-semibold">
                      {cliente.user_id?.telefono || "-"}
                    </td>
                    <td className="py-2 px-4 text-white font-semibold">
                      {Array.isArray(cliente.user_id?.rol)
                        ? cliente.user_id.rol.join(", ")
                        : cliente.user_id?.rol || "-"}
                    </td>
                    <td className="py-2 px-4 flex gap-2 justify-center">
                      <button
                        className="cursor-pointer hover:scale-105 hover:animate-pulse text-white px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(cliente);
                        }}
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <button
                        className="cursor-pointer hover:scale-105 hover:animate-pulse text-white px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(cliente);
                        }}
                      >
                        <span className="material-symbols-outlined">Edit</span>
                      </button>
                      <button
                        className="cursor-pointer hover:scale-105 hover:animate-pulse text-red-500 px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cliente);
                        }}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal Detalles */}
          {detailModal.show && (
            <Modal onClose={() => setDetailModal(initialModalState)}>
              <h2 className="text-5xl font-black text-green-800 mb-2 text-center">
                Detalles
              </h2>
              <p className="my-5">
                <b className="text-xl text-green-800 font-black">Nombre:</b>{" "}
                {detailModal.cliente.user_id?.nombre}
              </p>
              <p className="my-5">
                <b className="text-xl text-green-800 font-black">Email:</b>{" "}
                {detailModal.cliente.user_id?.email}
              </p>
              <p className="my-5">
                <b className="text-xl text-green-800 font-black">Teléfono:</b>{" "}
                {detailModal.cliente.user_id?.telefono}
              </p>
              <p className="my-5">
                <b className="text-xl text-green-800 font-black">Rol:</b>{" "}
                {Array.isArray(detailModal.cliente.user_id?.rol)
                  ? detailModal.cliente.user_id.rol.join(", ")
                  : detailModal.cliente.user_id?.rol || "-"}
              </p>
              <button
                className="bg-green-800 hover:scale-105 hover:animate-pulse hover:bg-green-950 cursor-pointer mt-4 px-4 py-2 rounded font-black text-white"
                onClick={() => setDetailModal(initialModalState)}
              >
                Cerrar
              </button>
            </Modal>
          )}

          {/* Modal Editar */}
          {editModal.show && (
            <Modal onClose={() => setEditModal(initialModalState)}>
              <h2 className="text-5xl text-green-800 font-black text-center mb-2">
                Editar cliente
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  name="nombre"
                  value={editForm.nombre}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nombre: e.target.value })
                  }
                  className="border-b-2 p-2 w-2/3 border-green-800"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="border-b-2 p-2 w-2/3 border-green-800"
                  required
                />
                <input
                  type="text"
                  name="telefono"
                  value={editForm.telefono}
                  onChange={(e) =>
                    setEditForm({ ...editForm, telefono: e.target.value })
                  }
                  className="border-b-2 p-2 w-2/3 border-green-800"
                  required
                />
                  <input
                    name="rol"
                    value={editForm.rol}
                    onChange={(e) =>
                      setEditForm({ ...editForm, rol: e.target.value })
                    }
                    className="border-b-2 p-2 w-2/3 border-green-800"
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
                    className="bg-gray-300 px-4 py-2 rounded-xl font-bold cursor-pointer hover:scale-105 hover:animate-pulse"
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
              <h2 className="text-xl font-black mb-4 ">
                ¿Eliminar cliente "{deleteModal.cliente.user_id?.nombre}"?
              </h2>
              <div className="flex gap-2 items-end justify-center h-50">
                <button
                  className="bg-red-600 cursor-pointer hover:scale-105 hover:animate-pulse text-white px-4 py-2 rounded"
                  onClick={confirmDelete}
                >
                  Eliminar
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:scale-105 hover:animate-pulse"
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
      <div className="bg-white rounded-xl p-6 min-w-[420px] min-h-[420px] relative border-b-8 border-l-8 border-r-2 border-t-2 border-green-800">
        {children}
      </div>
    </div>
  );
}

export default ClientesList;
