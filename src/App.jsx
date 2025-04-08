import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login/Login';
import Signin from './pages/Auth/Signin/Signin';
import ProtectedLayout from './layouts/ProtectedLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function ProtectedRoute() {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (currentUser === undefined) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
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
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          {/* Otras rutas protegidas aquí */}
        </Route>
      </Route>

      {/* Ruta para manejar páginas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
