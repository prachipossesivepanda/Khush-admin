// PaymentMode.jsx
import React from 'react';

export default function PaymentMode() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header / Navbar area */}
      <div className="bg-white border-b px-4 py-3.5 flex items-center">
        <button className="text-gray-700 mr-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">PAYMENT MODE</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 px-5 pt-6">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 tracking-wide">
            SELECT PAYMENT MODE
          </h2>
        </div>

        <div className="space-y-4">
          {/* Online Option */}
          <button 
            className="w-full bg-white border border-gray-300 rounded-lg p-4 flex items-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          >
            <div className="mr-4 text-blue-600">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                />
              </svg>
            </div>
            <span className="text-lg font-medium text-gray-900">Online</span>
          </button>

          {/* Cash Option */}
          <button 
            className="w-full bg-white border border-gray-300 rounded-lg p-4 flex items-center hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all"
          >
            <div className="mr-4 text-green-600">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 9V7a5 5 0 00-10 0v2m-2 0h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 13v.01" 
                />
              </svg>
            </div>
            <span className="text-lg font-medium text-gray-900">Cash</span>
          </button>
        </div>
      </div>

    </div>
  );
}