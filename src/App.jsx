import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login/Login';
import Signin from './pages/Auth/Signin/Signin';
import './App.css';
import Cupon from './pages/cupon/Cupon';
import Dashboard from './pages/dashbord/dashbord';
import RecentMovements from './pages/RecentMovements/RecentMovements';
import Welcome from './pages/Welcome/Welcome';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/Cupon" element={<Cupon/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/RecentMovements" element={<RecentMovements/>}/>
        <Route path="/Welcome" element={<Welcome/>}/>
        
        
        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
