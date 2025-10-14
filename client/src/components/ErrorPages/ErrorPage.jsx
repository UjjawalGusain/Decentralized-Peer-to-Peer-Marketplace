import React from 'react';

function ErrorPage({message}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-gray-600 mb-6">{`${message}`}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-[#FEC010] text-white rounded-lg hover:bg-red-600 transition"
      >
        Try Again
      </button>
    </div>
  );
}

export default ErrorPage;
