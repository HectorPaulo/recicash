import Sidebar from "../../Components/Sidebar/Sidebar";
const Cupon = () => {
  return (
    <div className="min-h-screen flex flex-col mt-15">
      <div className="flex flex-1 p-6 gap-6">

      <Sidebar />
    <div className="flex flex-row items-center justify-center h-screen bg-white p-6">
      <div className="max-w-md w-full bg-white rounded-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-black mb-4">GreenPaper</h1>

        <div className="flex items-center text-gray-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1111.314-11.314l-4.243 4.243z"
              />
          </svg>
          <span>Ubicacion:</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
          </svg>
          <span>Horario:</span>
        </div>

        <p className="text-gray-500 mb-6 border-t border-gray-200 pt-4">
          Nulla mauris tellus, feugiat quis pharetra sed, gravida ac dui. Sed
          iaculis, metus faucibus elementum tincidunt, turpis mi viverra velit,
          pellentesque tristique neque mi eget nulla. Proin luctus elementum
          neque et pharetra.
        </p>

        <div className="flex items-center justify-center mb-6">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-l hover:bg-gray-300">
            -
          </button>
          <span className="px-4 py-2 bg-gray-100 text-gray-700">5</span>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r hover:bg-gray-300">
            +
          </button>
        </div>

        <button className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors">
          Apartar lugar
        </button>
      </div>
    </div>
              </div>
              </div>
  );
};

export default Cupon;
