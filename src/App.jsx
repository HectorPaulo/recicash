import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login/Login';
import Signup from './pages/Auth/Signup/Signup';
import ProtectedLayout from './layouts/ProtectedLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import Cupon from './pages/Cupon/Cupon';
import ActualizarPuntos from './pages/ActualizarPuntosCliente/ActualizarPuntosCliente'
import RecentMovements from './pages/RecentMovements/RecentMovements';
import Loader from './Components/Loader/Loader';
import './App.css';
import Settings from './pages/Settings/Settings';
import DeleteAccount from './pages/DeleteAccount/DeleteAccount'
import ClientesList from './pages/ListadoClientes/ListadoClientes';

function ProtectedRoute() {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (currentUser === undefined) {
    return <Loader fullScreen={true} size="xl" message="Verificando autenticación..." />;
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
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clientes" element={<ClientesList />} />
      <Route path="/cupon" element={<Cupon />} />
      <Route path="/movimientosrecientes" element={<RecentMovements />} />
      <Route path="/actualizardatoscliente" element={<ActualizarPuntos />} />
      <Route path="/eliminarcuenta" element={<DeleteAccount />} />
          <Route path="/settings" element={<Settings />} />
          {/* Otras rutas protegidas aquí */}
        </Route>
      </Route>

      {/* Ruta para manejar páginas no encontradas */}
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
