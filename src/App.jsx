import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard/Dashboard";
import Cupon from "./pages/Cupon/Cupon";
import ActualizarPuntos from "./pages/ActualizarPuntosCliente/ActualizarPuntosCliente";
import RecentMovements from "./pages/RecentMovements/RecentMovements";
import Loader from "./Components/Loader/Loader";
import "./App.css";
import Settings from "./pages/Settings/Settings";
import DeleteAccount from "./pages/DeleteAccount/DeleteAccount";
import ClientesList from "./pages/ListadoClientes/ListadoClientes";
import ProtectedByRole from "./components/ProtectedByRole";
import RegistrarEmpresa from "./pages/RegistrarEmpresa/RegistrarEmpresa";
import Empresas from "./pages/Empresas/Empresas";
import CuponListEmpresa from "./pages/Cupon/CuponEmpresa";
import ClienteCupones from "./pages/Cupon/CuponCliente";

function ProtectedRoute() {
  const { currentUser, isAuthenticated } = useAuth();

  if (currentUser === undefined) {
    return (
      <Loader
        fullScreen={true}
        size="xl"
        message="Verificando autenticación..."
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Rutas protegidas generales */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eliminarcuenta" element={<DeleteAccount />} />
          <Route path="/settings" element={<Settings />} />

          {/*Rutas solo para cliente*/}
          <Route element={<ProtectedByRole allowedRoles={["cliente"]} />}>
            <Route path="/mis-cupones" element={<ClienteCupones />} />
          </Route>

          {/* Rutas solo para empresa */}
          <Route element={<ProtectedByRole allowedRoles={["empresa"]} />}>
          <Route path="/cupon" element={<Cupon />} />
          <Route path="/movimientosrecientes" element={<RecentMovements />} />
            <Route path="/cupon" element={<Cupon />} />
            <Route path="/actualizar-puntos" element={<ActualizarPuntos />} />
          </Route>

          {/* Rutas solo para admin */}
          <Route element={<ProtectedByRole allowedRoles={["admin"]} />}>
          <Route path="/clientes" element={<ClientesList />} />
            <Route path="/admin" element={<div>Panel Admin</div>} />
            <Route path="/empresas" element={<Empresas />} />
          <Route path="/cupon" element={<Cupon />} />
            <Route path="/cupones" element={<CuponListEmpresa />} />
            <Route path="/registrar-empresa" element={<RegistrarEmpresa />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
