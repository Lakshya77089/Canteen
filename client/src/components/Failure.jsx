import React from 'react';
import { Link } from 'react-router-dom';

function Failure() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-red-600 mb-4">Order Failed</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but there was an error processing your order. Please try again later.
        </p>
        <Link
          to="/"
          className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default Failure;
