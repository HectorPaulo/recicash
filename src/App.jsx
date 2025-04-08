import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login/Login';
import Signin from './pages/Auth/Signin/Signin';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />

        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
