import { useAuth } from '../../contexts/AuthContext';
import natureImage from '/src/assets/Images/undraw_environment_9luj.svg';
import Aurora from '/src/Backgrounds/Aurora/Aurora';

const Home = () => {
  const { currentUser } = useAuth();

  const cards = [
    {
      title: '¿Por qué reciclar?',
      content: 'El reciclaje ayuda a reducir la contaminación, ahorrar energía y conservar recursos naturales.',
    },
    {
      title: 'Materiales reciclables',
      content: 'Papel, cartón, vidrio, plástico y metales son algunos de los materiales que puedes reciclar.',
    },
    {
      title: 'Consejos para reciclar',
      content: 'Limpia los materiales antes de reciclarlos y sepáralos según su tipo.',
    },
    {
      title: 'Impacto positivo',
      content: 'Reciclar una tonelada de papel puede salvar hasta 17 árboles y 26,500 litros de agua.',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Fondo Aurora */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>
      
      {/* Contenido existente */}
      <div className="relative z-10 mt-20 p-4 flex flex-col items-center">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8  p-8 rounded-xl">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center lg:text-left text-white">
              Bienvenido a <strong className="text-green-300">Recicash</strong>
            </h1>
            <p className="text-lg mb-8 text-center lg:text-left text-white">¡Hola, {currentUser?.email}!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border-2 border-white/20 shadow-lg hover:bg-white/80 transition-all duration-300"
                >
                  <h2 className="text-xl font-semibold mb-2 text-indigo-700">{card.title}</h2>
                  <p className="text-gray-800">{card.content}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <img src={natureImage} alt="Nature" className="w-full h-auto max-w-sm mx-auto drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
