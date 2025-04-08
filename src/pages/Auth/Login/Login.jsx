import GridDistortion from "/src/Backgrounds/GridDistortion/GridDistortion";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "/src/assets/Images/pexels-mahima-518693-1250260.jpg";
import { loginWithEmailAndPassword } from "../../../lib/firebase/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');
            
            const { user, error } = await loginWithEmailAndPassword(email, password);
            
            if (error) {
                let errorMessage = 'Error al iniciar sesión';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        errorMessage = 'Correo o contraseña incorrectos';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'Esta cuenta ha sido deshabilitada';
                        break;
                    default:
                        errorMessage = `Error: ${error.message}`;
                }
                
                setError(errorMessage);
                return;
            }
            
            console.log('Inicio de sesión exitoso:', user);
            
            const from = location.state?.from || '/home';
            navigate(from);
            
        } catch (err) {
            setError('Error inesperado al iniciar sesión');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
            {/* Fondo con efecto de distorsión */}
            <div className="absolute inset-0 w-full h-full z-0">
                <GridDistortion
                    imageSrc={backgroundImage}
                    grid={20}
                    mouse={0.4}
                    strength={0.5}
                    relaxation={0.8}
                    className="w-full h-full"
                />
            </div>
            
            {/* formulario */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl px-4">
                <div
                    className="backdrop-blur-2xl border-none border-gray-300 rounded-2xl hover:border-amber-950 transition-all duration-200 w-full"
                >
                    <form onSubmit={handleLogin} className="mx-auto flex items-center space-y-4 py-16 px-8 font-semibold text-gray-500 flex-col">
                        <svg className="w-1/2 h-1/2" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#fff"><path d="M480-100q-79 0-148-30t-120.5-81.5Q160-263 130-332t-30-148q0-79 30-148t81.5-120.5Q263-800 332-830t148-30v-100l160 160-160 160v-100q-108 0-184 76t-76 184q0 66 30.5 122.5T332-266q16-28 47.5-47.5T452-338q-3-21-8-42t-12-39q-11 9-24 14t-28 5q-33 0-56.5-23.5T300-480v-40q0-17-5.5-32T280-580q50-1 89 9 34 9 62 29.5t29 61.5q0 9-1.5 16.5T453-448q-13-10-26-18t-27-14q17 13 39 40t41 64q20-49 50-96.5t70-87.5q-23 16-44 34t-41 38q-7-11-11-24.5t-4-27.5q0-42 29-71t71-29h40q23 0 38-6t25-14q11-9 17-20 4 67-7 120-9 45-34 82.5T600-440q-15 0-28.5-4T547-455q-7 19-16 50.5T517-337q38 7 67 26t44 45q51-35 81.5-91T740-480h120q0 79-30 148t-81.5 120.5Q697-160 628-130t-148 30Z"/></svg>
                        <h1 className="text-white text-2xl">Ingresar a Recicash</h1>
                        
                        {/* Mensaje de error */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        <input
                            className="w-full p-2 bg-transparent rounded-md border-2 border-gray-200 focus:border-green-400 hover:border-green-400 transition-all duration-200 text-white"
                            placeholder="Ej. juan@example.com"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="w-full p-2 bg-transparent rounded-md border-2 border-gray-200 focus:border-green-400 hover:border-green-400 transition-all duration-200 text-white"
                            placeholder="Contraseña"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            className={`w-2/3 p-2 rounded-xl font-black text-gray-900 hover:text-white cursor-pointer hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 bg-gray-300 border-none hover:border-blue-500 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verificando...' : 'Entrar'}
                        </button>
                        <p className="text-gray-300">
                            ¿Aún no tienes una cuenta?{" "}
                            <a
                                className="font-semibold text-white hover:text-green-500 transition-all duration-200"
                                href="/signin"
                            >
                                ¡Regístrate aquí!
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;