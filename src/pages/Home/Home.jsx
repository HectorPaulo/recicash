import Navbar from '../../Components/Navbar/Navbar';
import natureImage from '/src/assets/Images/undraw_environment_9luj.svg';
import Aurora from '/src/Backgrounds/Aurora/Aurora';
import {useNavigate} from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
          </svg>
      ),
      title: 'Impacto Ambiental',
      content: 'Reduce tu huella de carbono y contribuye a un planeta más sostenible a través del reciclaje inteligente.',
      stats: 'Menos CO₂'
    },
    {
      icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
      ),
      title: 'Recompensas Inteligentes',
      content: 'Obtén cupones y beneficios por cada acción de reciclaje. Tu compromiso tiene valor.',
      stats: '-$5 promedio'
    },
    {
      icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
      ),
      title: 'Seguimiento Inteligente',
      content: 'Monitorea tu progreso con analíticas detalladas y metas personalizadas.',
      stats: '98% precisión'
    },
    {
      icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
      ),
      title: 'Comunidad Activa',
      content: 'Únete a una red de usuarios comprometidos con el cambio ambiental positivo.',
      stats: '~10 usuarios'
    },
  ];

  const stats = [
    { number: '2.5', label: 'Kg Reciclados', icon: '♻️' },
    { number: '15K-', label: 'Usuarios Activos', icon: '👥' },
    { number: '98%', label: 'Satisfacción', icon: '⭐' },
    { number: '50+', label: 'Municipios', icon: '🌍' }
  ];

  return (
      <div className="relative min-h-screen bg-green-950">
        <div className="fixed inset-0 z-0">
          <Aurora
              colorStops={["#386641", "#6A994E", "#A7C957"]}
              blend={0.3}
              amplitude={0.8}
              speed={0.3}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20"></div>
        </div>

        <div className="relative z-10 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <span className="text-green-400 font-medium">🌱 Plataforma Líder en Reciclaje</span>
                  </div>

                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="text-white">El futuro del</span>
                    <br />
                    <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Reciclaje Inteligente
                  </span>
                  </h1>

                  <p className="text-xl text-gray-200 leading-relaxed max-w-xl">
                    Transforma tus hábitos de reciclaje en recompensas tangibles.
                    Únete a la revolución sostenible con tecnología de vanguardia.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => navigate('/login')} className="px-8 py-4 cursor-pointer bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">                    Comenzar Ahora
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-white">{stat.number}</div>
                        <div className="text-sm text-gray-300">{stat.label}</div>
                      </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-3xl blur-3xl"></div>
                <div className="relative  rounded-3xl p-8 ">
                  <img
                      src={natureImage}
                      alt="Reciclaje Inteligente"
                      className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                ¿Por qué elegir Recicash?
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Descubre las características que nos convierten en la plataforma líder
                para el reciclaje inteligente y sostenible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                  <div
                      key={index}
                      className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:-translate-y-2"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <span className="text-sm font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                      {feature.content}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </div>

      </div>
  );
};

export default Home;