import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login/Login';
import Signin from './pages/Auth/Signin/Signin';
import ProtectedLayout from './layouts/ProtectedLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard/Dashboard';
import Cupon from './pages/Cupon/Cupon';
import RecentMovements from './pages/RecentMovements/RecentMovements';
import Loader from './Components/Loader/Loader';
import './App.css';
import Settings from './pages/Settings/Settings';

function ProtectedRoute() {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (currentUser === undefined) {
    // Reemplazar el div con nuestro Loader
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
      <Route path="/signin" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cupon" element={<Cupon />} />
      <Route path="/MovimientosRecientes" element={<RecentMovements />} />
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
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
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
