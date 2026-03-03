// ProfileScreen.jsx
import React from 'react';

export default function ProfileScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center pt-8 px-4">
        {/* Profile Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header / Cover area */}
          <div className="h-44 bg-black relative">
            {/* Avatar - positioned overlapping the black header */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400"
                  alt="Ace Smith"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Name & Style Preference */}
          <div className="pt-20 pb-10 px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">ACE SMITH</h1>
            <p className="mt-2 text-gray-600 font-medium">
              Style Preference Here
            </p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-10 w-full max-w-md">
          <button
            className="
              w-full flex items-center justify-between 
              bg-white px-5 py-4 rounded-xl shadow-sm
              text-left text-gray-800 font-medium
              hover:bg-gray-50 active:bg-gray-100
              transition-colors
            "
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>EDIT PROFILE</span>
            </div>

            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}