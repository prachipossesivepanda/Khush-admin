// ProfileScreen.tsx
import React from 'react';

export default function ProfileScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header / Navbar */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 relative">
        <button className="absolute left-4 text-gray-700 text-2xl font-light">
          ←
        </button>
        <h1 className="text-lg font-semibold mx-auto tracking-wide">
          PROFILE
        </h1>
      </div>

      {/* Main content */}
      <div className="flex-1 px-5 pt-8 pb-10 flex flex-col">
        {/* Profile photo + camera icon */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Small camera icon button */}
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center border-2 border-white shadow">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-6 px-2">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Name</label>
            <div className="border-b border-gray-300 pb-3">
              <p className="text-gray-900"> {/* ← can be dynamic */} </p>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Phone Number</label>
            <div className="border-b border-gray-300 pb-3">
              <p className="text-gray-900"> {/* ← can be dynamic */} </p>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">E mail ID</label>
            <div className="border-b border-gray-300 pb-3">
              <p className="text-gray-900"> {/* ← can be dynamic */} </p>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Edit Profile Button */}
        <button
          className="
            w-full py-4 mt-6
            bg-black text-white font-medium
            rounded-xl text-base tracking-wide
            active:bg-gray-900 transition-colors
          "
        >
          EDIT PROFILE
        </button>
      </div>
    </div>
  );
}