import React from "react";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl mt-4">Oops! Page not found.</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-block text-blue-500"
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
