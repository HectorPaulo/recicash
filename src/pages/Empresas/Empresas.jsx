/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.jsx";

const initialModalState = {
  show: false,
  empresa: null,
};
const initialUserModalState = {
  show: false,
  user: null,
};

const Empresas = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detailModal, setDetailModal] = useState(initialModalState);
  const [editModal, setEditModal] = useState(initialModalState);
  const [deleteModal, setDeleteModal] = useState(initialModalState);
  const [userModal, setUserModal] = useState(initialUserModalState);
  const [editForm, setEditForm] = useState({ empresa: "", ubicacion: "" });
  const { isAdmin, isEmpresa, isCliente } = useAuth();

  // Fetch empresas
  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/empresa");
      setEmpresas(res.data);
    } catch {
      setEmpresas([]);
    }
  };

  // Ver detalles
  const handleView = (empresa) => {
    setDetailModal({ show: true, empresa });
  };

  // Ver responsable
  const handleViewUser = (user) => {
    setUserModal({ show: true, user });
  };

  // Editar
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
    } catch (error) {
      alert("Error al editar empresa");
    }
  };

  // Eliminar
  const handleDelete = (empresa) => {
    setDeleteModal({ show: true, empresa });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/empresa/${deleteModal.empresa.id}`
      );
      setDeleteModal(initialModalState);
      fetchEmpresas();
    } catch (error) {
      alert("Error al eliminar empresa");
    }
  };

  return (
    <div className="min h-screen flex flex-col pt-15 bg-gradient-to-t from-[#6A994E] to-[#A7C957]">
      <div className="flex flex-1 p-6 gap-6">

        <div className="flex flex-col items-center min-w-2/3 justify-start min-h-screen">
          <h1 className="text-6xl text-white font-black mb-4">Empresas</h1>
          <div className="overflow-x-auto w-full max-w-4xl">
            <table className="min-w-full mt-20 rounded-xl shadow-xl bg-transparent">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-white font-black text-xl bg-transparent">
                    Empresa
                  </th>
                  <th className="py-2 px-4 border-b text-white font-black text-xl bg-transparent">
                    Ubicación
                  </th>
                  <th className="py-2 px-4 border-b text-white font-black text-xl bg-transparent">
                    Responsable
                  </th>
                  <th className="py-2 px-4 border-b text-white font-black text-xl bg-transparent">
                    Cupones
                  </th>
                  <th className="py-2 px-4 border-b text-white font-black text-xl bg-transparent">
                    #
                  </th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr
                    key={empresa.id}
                    className={`text-center ${
                      selected?.id === empresa.id ? "bg-green-900/30" : ""
                    }`}
                    onClick={() => setSelected(empresa)}
                  >
                    <td className="py-2 px-4 text-white">
                      {empresa.empresa || "-"}
                    </td>
                    <td className="py-2 px-4 text-white">
                      {empresa.ubicacion || "-"}
                    </td>
                    <td className="py-2 px-4 text-white">
                      <button
                        className="text-white font-bold hover:text-green-800 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewUser(empresa.user_id);
                        }}
                      >
                        {empresa.user_id?.nombre || "-"}
                      </button>
                    </td>
                    <td className="py-2 px-4 text-white">
                      {Array.isArray(empresa.cupones)
                        ? empresa.cupones.length
                        : "-"}
                    </td>
                    <td className="py-2 px-4 flex gap-2 justify-center text-white">
                      <button
                        className="cursor-pointer hover:scale-105 hover:animate-pulse text-blue-200 px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(empresa);
                        }}
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <button
                        className="cursor-pointer hover:scale-105 hover:animate-pulse text-yellow-200 px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(empresa);
                        }}
                      >
                        <span className="material-symbols-outlined">Edit</span>
                      </button>
                      <button
                        className="cursor-pointer hover:scale-105 hover:animate-pulse text-red-300 px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(empresa);
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
              <h2 className="text-5xl font-black text-white mb-2 text-center">
                Detalles
              </h2>
              <p className="my-5">
                <b className="text-xl text-white font-black">Empresa:</b>{" "}
                {detailModal.empresa.empresa}
              </p>
              <p className="my-5">
                <b className="text-xl text-white font-black">Ubicación:</b>{" "}
                {detailModal.empresa.ubicacion}
              </p>
              <p className="my-5">
                <b className="text-xl text-white font-black">Responsable:</b>{" "}
                <button
                  className="text-blue-200 underline font-bold hover:text-blue-400"
                  onClick={() => {
                    setUserModal({
                      show: true,
                      user: detailModal.empresa.user_id,
                    });
                  }}
                >
                  {detailModal.empresa.user_id?.nombre || "-"}
                </button>
              </p>
              <p className="my-5">
                <b className="text-xl text-white font-black">Email:</b>{" "}
                {detailModal.empresa.user_id?.email}
              </p>
              <p className="my-5">
                <b className="text-xl text-white font-black">Teléfono:</b>{" "}
                {detailModal.empresa.user_id?.telefono}
              </p>
              <p className="my-5">
                <b className="text-xl text-white font-black">Cupones:</b>{" "}
                {Array.isArray(detailModal.empresa.cupones)
                  ? detailModal.empresa.cupones.length
                  : "-"}
              </p>
              <button
                className="bg-green-800 hover:scale-105 hover:animate-pulse hover:bg-green-950 cursor-pointer mt-4 px-4 py-2 rounded font-black text-white"
                onClick={() => setDetailModal(initialModalState)}
              >
                Cerrar
              </button>
            </Modal>
          )}

          {/* Modal Detalles Responsable */}
          {userModal.show && (
            <Modal onClose={() => setUserModal(initialUserModalState)}>
              <h2 className="text-3xl font-black text-white mb-2 text-center">
                Responsable
              </h2>
              <p className="my-2">
                <b className="text-white">Nombre:</b> {userModal.user?.nombre}
              </p>
              <p className="my-2">
                <b className="text-white">Email:</b> {userModal.user?.email}
              </p>
              <p className="my-2">
                <b className="text-white">Teléfono:</b>{" "}
                {userModal.user?.telefono}
              </p>
              <p className="my-2">
                <b className="text-white">Rol:</b>{" "}
                {Array.isArray(userModal.user?.rol)
                  ? userModal.user.rol.join(", ")
                  : userModal.user?.rol || "-"}
              </p>
              <p className="my-2">
                <b className="text-white">Activo:</b>{" "}
                {userModal.user?.isActive ? "Sí" : "No"}
              </p>
              <button
                className="bg-green-800 hover:scale-105 hover:animate-pulse hover:bg-green-950 cursor-pointer mt-4 px-4 py-2 rounded font-black text-white"
                onClick={() => setUserModal(initialUserModalState)}
              >
                Cerrar
              </button>
            </Modal>
          )}

          {/* Modal Editar */}
          {editModal.show && (
            <Modal onClose={() => setEditModal(initialModalState)}>
              <h2 className="text-5xl text-white font-black text-center mb-2">
                Editar empresa
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  name="empresa"
                  value={editForm.empresa}
                  onChange={(e) =>
                    setEditForm({ ...editForm, empresa: e.target.value })
                  }
                  className="border-b-2 p-2 w-2/3 border-green-800 bg-transparent text-white"
                  required
                />
                <input
                  type="text"
                  name="ubicacion"
                  value={editForm.ubicacion}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ubicacion: e.target.value })
                  }
                  className="border-b-2 p-2 w-2/3 border-green-800 bg-transparent text-white"
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
                ¿Eliminar empresa "{deleteModal.empresa.empresa}"?
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

          {/* Botón Agregar empresa */}
          {!isAdmin && (

          <div className="w-full flex justify-end mt-8">
            <button
              className="bg-green-800 hover:scale-105 hover:animate-pulse hover:bg-green-950 cursor-pointer px-4 py-2 rounded font-black text-white flex items-center gap-2"
              onClick={() => navigate("/registrar-empresa")}
            >
              Agregar empresa
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ">
      <div className="bg-green-900/90 rounded-xl p-6 min-w-[420px] min-h-[420px] relative border-b-8 border-l-8 border-r-2 border-t-2 border-green-200">
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

export default Empresas;
