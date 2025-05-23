/* eslint-disable no-unused-vars */

import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const DeleteAccount = () => {
  const { currentUser, logout } = useAuth();

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/auth/${currentUser.id}/delete`
      );
      logout();
    } catch (err) {
      alert("Error al eliminar cuenta");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-4 py-2 rounded"
    >
      Eliminar mi cuenta
    </button>
  );
};

export default DeleteAccount;
