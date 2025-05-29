import GridDistortion from "/src/Backgrounds/GridDistortion/GridDistortion";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "/src/assets/Images/pexels-mahima-518693-1250260.jpg";
import Loader from "../../../Components/Loader/Loader";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user, error } = await login(email, password);
      if (error) {
        await Swal.fire("Error", error.message || "Error al iniciar sesión", "error");
        return;
      }
      await Swal.fire("¡Bienvenido!", "Inicio de sesión exitoso", "success");
      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      await Swal.fire("Error", "Error inesperado al iniciar sesión", "error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="relative flex items-center px-2 py-2 h-screen w-screen overflow-hidden bg-gray-900">
        {/* Fondo dinámico */}
        <div className="absolute inset-0 w-full h-full z-0">
          <GridDistortion
              imageSrc={backgroundImage}
              grid={25}
              mouse={0.3}
              strength={0.6}
              relaxation={0.9}
              className="w-full h-full"
          />
        </div>

        {/* Formulario */}
        <div className="relative z-10 w-full max-w-2xl px-8 py-12 backdrop-blur-sm bg-black/40  rounded-lg shadow-2xl max-h-screen h-full  ">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center">
              <svg
                  className="mx-auto w-16 h-16 text-white mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
              >
                <path d="M480-100q-79 0-148-30t-120.5-81.5Q160-263 130-332t-30-148q0-79 30-148t81.5-120.5Q263-800 332-830t148-30v-100l160 160-160 160v-100q-108 0-184 76t-76 184q0 66 30.5 122.5T332-266q16-28 47.5-47.5T452-338q-3-21-8-42t-12-39q-11 9-24 14t-28 5q-33 0-56.5-23.5T300-480v-40q0-17-5.5-32T280-580q50-1 89 9 34 9 62 29.5t29 61.5q0 9-1.5 16.5T453-448q-13-10-26-18t-27-14q17 13 39 40t41 64q20-49 50-96.5t70-87.5q-23 16-44 34t-41 38q-7-11-11-24.5t-4-27.5q0-42 29-71t71-29h40q23 0 38-6t25-14q11-9 17-20 4 67-7 120-9 45-34 82.5T600-440q-15 0-28.5-4T547-455q-7 19-16 50.5T517-337q38 7 67 26t44 45q51-35 81.5-91T740-480h120q0 79-30 148t-81.5 120.5Q697-160 628-130t-148 30Z" />
              </svg>
              <h1 className="text-white text-3xl font-semibold">Accede a Recicash</h1>
              <p className="text-gray-300 mt-2 text-sm">Sistema de Gestión Empresarial</p>
            </div>

            <div className="flex flex-col space-y-12 my-20 items-center">
              <input
                  className="w-2/3 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Correo electrónico"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <input
                  className="w-2/3 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contraseña"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>

            <div className="flex flex-col items-center mb-15">
            <button
                type="submit"
                disabled={isLoading}
                className={`w-1/2 py-3 rounded-lg bg-gradient-to-l from-green-700 to-green-950 cursor-pointer hover:scale-105 hover:bg-gradient-to-l hover:from-green-500 hover:to-green-800 transition-all text-white font-semibold shadow-lg ${
                    isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader size="sm" />
                    <span className="ml-2">Verificando...</span>
                  </div>
              ) : (
                  "Entrar"
              )}
            </button>
            </div>

            <p className="text-sm text-gray-300 text-center">
              ¿No tienes cuenta?{" "}
              <a href="/signup" className="text-green-400 hover:text-green-500 font-semibold transition">
                Regístrate
              </a>
            </p>
          </form>
        </div>

        {isLoading && <Loader fullScreen={true} message="Iniciando sesión..." />}
      </div>
  );
};

export default Login;
