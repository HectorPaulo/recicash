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
import ClienteCupones from "./pages/Cupon/CuponCliente";
import Navbar from "./Components/Navbar/Navbar.jsx";
import {PuntosProvider} from "./contexts/PuntosProvider.tsx";

function ProtectedRoute() {
  const { currentUser, isAuthenticated } = useAuth();

  if (currentUser === undefined) {
        window.location.reload();
  }

  if (!isAuthenticated) {
    return <Navigate to="/home" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
          <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Rutas protegidas generales */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eliminarcuenta" element={<DeleteAccount />} />
          <Route path="/settings" element={<Settings />} />

          {/*Rutas solo para cliente*/}
          <Route element={<ProtectedByRole allowedRoles={["cliente"]} />}>
            <Route path="/mis-cupones" element={<ClienteCupones />} />
          <Route path="/movimientosrecientes" element={<RecentMovements />} />
          </Route>

          {/* Rutas solo para empresa */}
          <Route element={<ProtectedByRole allowedRoles={["empresa"]} />}>
          <Route path="/cupon" element={<Cupon />} />
          <Route path="/movimientosrecientes" element={<RecentMovements />} />
            <Route path="/cupon" element={<Cupon />} />
          </Route>

          {/* Rutas solo para admin */}
          <Route element={<ProtectedByRole allowedRoles={["admin"]} />}>
            <Route path="/cupon" element={<Cupon />}></Route>
          <Route path="/clientes" element={<ClientesList />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/registrar-empresa" element={<RegistrarEmpresa />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PuntosProvider>
        <AppRoutes />
        </PuntosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
