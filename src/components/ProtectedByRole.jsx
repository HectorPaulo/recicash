import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedByRole = ({ allowedRoles }) => {
  const { currentUser } = useAuth();
  const roles = currentUser?.rol || currentUser?.user_id?.rol || [];
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!roles.some((r) => allowedRoles.includes(r))) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

export default ProtectedByRole;
