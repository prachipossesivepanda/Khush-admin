// Otp.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Khush from "../../../assets/images/khushh.svg";

export default function Otp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const mobile = state?.mobile || "xxxxxxxxxx";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-focus previous on backspace (if empty)
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length > 0) {
      const digits = pasted.split("").slice(0, 6);
      setOtp((prev) => {
        const newOtp = [...prev];
        digits.forEach((d, i) => {
          if (i < 6) newOtp[i] = d;
        });
        return newOtp;
      });
      // Focus last filled or last input
      const nextFocus = Math.min(digits.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      console.log("Verifying OTP:", enteredOtp, "for mobile:", mobile);
      // TODO: Replace with real API call
      alert("OTP Verified! (mock success)");
      // navigate("/dashboard");
    } else {
      alert("Please enter complete 6-digit OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      {/* Main centered BOX / CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Inner content with padding */}
        <div className="p-8 sm:p-10 space-y-8">
          {/* Logo & Title */}
          <div className="text-center space-y-4">
            <img
              src={Khush}
              alt="Khush Logo"
              className="w-24 mx-auto drop-shadow-md"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Verify Mobile Number
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Enter the OTP sent to{" "}
              <span className="font-semibold text-gray-800">
                +91 {mobile}
              </span>
            </p>
          </div>

          {/* OTP Inputs – Box-like structure */}
          <div className="flex justify-center gap-3 sm:gap-4 my-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                className="w-12 sm:w-14 h-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold 
                           border border-gray-300 rounded-xl 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                           bg-white shadow-sm transition-all outline-none"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="w-full bg-gray-900 hover:bg-gray-800 
                       text-white font-semibold py-4 rounded-xl 
                       text-lg shadow-md transition-all duration-300 
                       hover:shadow-lg active:scale-[0.98]"
          >
            Verify OTP
          </button>

          {/* Resend Timer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {timer > 0 ? (
                <>Resend OTP in <span className="font-medium">00:{timer.toString().padStart(2, "0")}</span></>
              ) : (
                <button
                  onClick={() => {
                    setTimer(30);
                    setOtp(["", "", "", "", "", ""]);
                    inputRefs.current[0]?.focus();
                    alert("OTP resent! (mock)");
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}