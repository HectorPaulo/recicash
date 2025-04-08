import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../lib/firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Bienvenido a Recicash</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
        
        {currentUser && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
              <span className="font-medium">Usuario:</span> {currentUser.displayName || 'Usuario sin nombre'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {currentUser.email}
            </p>
          </div>
        )}
        
        <p className="text-gray-600">
          Esta es una página protegida. Solo usuarios autenticados pueden verla.
        </p>
      </div>
    </div>
  );
};

export default Home;
