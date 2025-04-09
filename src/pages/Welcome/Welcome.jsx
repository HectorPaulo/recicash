import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-green-600 text-white px-8 py-4">
        <div className="text-xl font-bold">RecicASH</div>
        <div className="flex items-center space-x-6 text-sm">
          <span className="cursor-pointer">Mi cuenta ▾</span>
          <span className="cursor-pointer">About Us</span>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 p-8 bg-white m-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 leading-tight">
            Welcome, Let's Talk<br />
            About RecicASH
          </h1>

          <div className="space-y-6 text-gray-700 max-w-2xl">
            <p className="text-justify">
              In information set to each location found...
            </p>

            <p className="text-justify">
              You have the right answer with respect. None of us has been in charge on our own location. 
              Once we can see this information, you will need to make sure that your location is not a good destination.
            </p>

            <p className="text-justify font-medium">
              If there were no changes or changes, you will need to make sure that your location is not a good destination.
            </p>

            <p className="text-justify font-medium">
              From location monitor to which temporal observations,
            </p>

            <p className="text-justify">
              In information set to each location found...
            </p>

            <p className="text-justify font-medium">
              Answer each query over time to support digitisation.
            </p>

            <p className="text-justify font-medium">
              And calculate what all temporal occurrences.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm text-gray-600 border-t border-gray-200">
        © 2025 Recicash Todos los derechos reservados.
      </div>
    </div>
  );
};

export default Welcome;