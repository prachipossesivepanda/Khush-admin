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

  // ─── Debug: Component Mount ───────────────────────────────────────
  useEffect(() => {
    console.log("[OTP] Component mounted");
    console.log("[OTP] Received location state:", state);
    console.log("[OTP] Mobile number:", mobile);
    console.log("[OTP] Initial OTP:", otp);

    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, []);

  // ─── Timer countdown ───────────────────────────────────────────────
  useEffect(() => {
    if (timer > 0) {
      console.log(`[OTP Timer] Starting countdown from ${timer}`);
      const interval = setInterval(() => {
        setTimer((prev) => {
          const next = prev - 1;
          if (next % 5 === 0 || next <= 5) {
            console.log(`[OTP Timer] ${next}s remaining`);
          }
          return next;
        });
      }, 1000);

      return () => {
        console.log("[OTP Timer] Clearing interval");
        clearInterval(interval);
      };
    } else {
      console.log("[OTP Timer] Reached 0 → resend enabled");
    }
  }, [timer]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value) || value.length > 1) return;

    console.log(`[OTP Input] Changed index ${index} → value "${value}"`);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    console.log("[OTP Input] Current OTP array:", newOtp);
    console.log("[OTP Input] Current code:", newOtp.join(""));

    // Auto-focus next
    if (value && index < 5) {
      console.log(`[OTP Input] Moving focus → ${index + 1}`);
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-focus previous on delete (when field becomes empty)
    if (!value && index > 0) {
      console.log(`[OTP Input] Moving focus back → ${index - 1}`);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      console.log(`[OTP KeyDown] Backspace on empty field → focus ${index - 1}`);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    console.log("[OTP Paste] Raw pasted content:", e.clipboardData.getData("text"));
    console.log("[OTP Paste] Cleaned digits:", pasted);

    if (pasted.length > 0) {
      const digits = pasted.split("").slice(0, 6);
      console.log("[OTP Paste] Applying digits:", digits);

      setOtp((prev) => {
        const newOtp = [...prev];
        digits.forEach((d, i) => {
          if (i < 6) newOtp[i] = d;
        });
        console.log("[OTP Paste] New OTP after paste:", newOtp);
        return newOtp;
      });

      const nextFocus = Math.min(digits.length, 5);
      console.log(`[OTP Paste] Focusing index ${nextFocus} after paste`);
      inputRefs.current[nextFocus]?.focus();
    }
  };

const handleVerify = () => {
  const code = otp.join("");

  if (code.length !== 6) {
    return;
  }

  // Direct navigation without token
  navigate("/influencer/dashboard", { replace: true });
};
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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

          {/* OTP Inputs */}
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
                <>
                  Resend OTP in{" "}
                  <span className="font-medium">
                    00:{timer.toString().padStart(2, "0")}
                  </span>
                </>
              ) : (
                <button
                  onClick={() => {
                    console.log("[OTP Resend] Resend button clicked");
                    setTimer(30);
                    setOtp(["", "", "", "", "", ""]);
                    console.log("[OTP Resend] OTP reset & timer restarted");
                    inputRefs.current[0]?.focus();
                    alert("OTP resent! (mock mode)");
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