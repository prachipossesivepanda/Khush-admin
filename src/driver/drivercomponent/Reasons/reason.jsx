// src/components/UndeliveredReason.jsx
import React, { useState } from 'react';

const reasons = [
  "CUSTOMER NOT AVAILABLE AT ADDRESS",
  "INCORRECT OR INCOMPLETE ADDRESS",
  "CUSTOMER NOT REACHABLE",
  "ACCESS ISSUE",
  "CASH NOT AVAILABLE (COD)",
  "ORDER REFUSED BY CUSTOMER",
  "KYC / OTP ISSUE",
  "OTHER REASON",
];

const UndeliveredReason = () => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("Please select a reason");
      return;
    }

    // Simulate API call or real submission
    console.log("Submitted reason:", selectedReason);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-center">REASON FOR NOT DELIVERED</h1>
      </div>

      {/* Reasons */}
      <div className="flex-1 p-6 space-y-5">
        {reasons.map((reason) => (
          <label
            key={reason}
            className="flex items-start gap-4 cursor-pointer group"
            onClick={() => setSelectedReason(reason)}
          >
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5
                ${selectedReason === reason
                  ? "border-black bg-black"
                  : "border-gray-400 group-hover:border-gray-700"}`}
            >
              {selectedReason === reason && (
                <div className="w-4 h-4 rounded-full bg-white" />
              )}
            </div>
            <span className="text-[17px] leading-6 text-gray-800">{reason}</span>
          </label>
        ))}
      </div>

      {/* Submit */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={!selectedReason}
          className={`w-full py-4 rounded-xl font-semibold text-lg tracking-wide transition-colors
            ${selectedReason
              ? "bg-black text-white hover:bg-gray-900 active:bg-gray-950"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
        >
          SUBMIT
        </button>
      </div>

      {/* Success Modal - trying to match screenshot more closely */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-5"
          onClick={() => setShowSuccessModal(false)} // close when clicking outside
        >
          <div
            className="bg-white rounded-3xl w-full max-w-[340px] relative shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl font-light z-10"
            >
              ×
            </button>

            {/* Content */}
            <div className="pt-16 pb-14 px-10 flex flex-col items-center">
              <div className="relative mb-8">
                {/* Circle + Check */}
                <div className="w-28 h-28 rounded-full border-4 border-black flex items-center justify-center">
                  <span className="text-black text-6xl font-bold leading-none">✓</span>
                </div>

                {/* Sparkles - more like the screenshot */}
                <div className="absolute -top-5 -right-3 text-yellow-400 text-4xl animate-pulse">✨</div>
                <div className="absolute -bottom-4 -left-4 text-yellow-400 text-4xl animate-pulse delay-75">✨</div>
                <div className="absolute top-2 -right-8 text-yellow-300 text-3xl animate-pulse delay-150">✨</div>
                <div className="absolute -bottom-2 left-10 text-yellow-300 text-3xl animate-pulse delay-200">✨</div>
              </div>

              <h2 className="text-2xl font-bold text-center tracking-wider leading-tight">
                SUBMITTED
                <br />
                SUCCESSFULLY
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UndeliveredReason;