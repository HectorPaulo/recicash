import { useAuth } from '../../contexts/AuthContext';
import natureImage from '/src/assets/Images/undraw_environment_9luj.svg';

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
    <div className='mt-20 p-4 flex flex-col items-center'>
      <div className='w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div>
          <h1 className='text-2xl font-bold mb-4 text-center lg:text-left'>
            Bienvenido a <strong className='text-green-700'>Recicash</strong>
          </h1>
          <p className='text-lg mb-8 text-center lg:text-left'>¡Hola, {currentUser?.email}!</p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {cards.map((card, index) => (
              <div
                key={index}
                className='bg-white rounded-lg p-6 border-2 border-gray-200'
              >
                <h2 className='text-xl font-semibold mb-2'>{card.title}</h2>
                <p className='text-gray-700'>{card.content}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='hidden lg:block my-auto'>
          <img src={natureImage} alt='Nature' className='w-full h-auto max-w-sm mx-auto' />
        </div>
      </div>
    </div>
  );
};

export default Home;
