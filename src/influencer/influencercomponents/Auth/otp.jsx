// Otp.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ← added useSelector for debugging
import { jwtDecode } from "jwt-decode";

import Khush from "../../../assets/images/khushh.svg";
import { verifyOtp, resendOtp } from "../../influencerapis/authapi";
import { setToken } from "../../../redux/GlobalSlice";

export default function Otp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Optional: helps you see current token in Redux during debugging
  const reduxToken = useSelector((state) => state.global?.token); // adjust path if your slice name / structure is different

  const mobile = state?.mobile || "xxxxxxxxxx";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    const digits = pasted.split("").slice(0, 6);
    const newOtp = ["", "", "", "", "", ""];
    digits.forEach((d, i) => (newOtp[i] = d));
    setOtp(newOtp);
    if (digits.length > 0)
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("[OTP] Starting verification for code:", code);

      const userId = localStorage.getItem("userId");
      console.log("[OTP] userId from localStorage:", userId);
      if (!userId) throw new Error("User ID not found in localStorage");

      const response = await verifyOtp(userId, code);
      console.log("[OTP] Full API response:", response);

      const token =
        response?.accessToken || response?.data?.accessToken || null;

      console.log(
        "[OTP] Extracted token:",
        token ? token.substring(0, 20) + "..." : "NO TOKEN",
      );

      if (!token) {
        throw new Error("No token found in API response");
      }

      // ─── Dispatch happens here ───
      dispatch(setToken(token));
      console.log(
        "[OTP] Dispatched setToken() with token (first 20 chars):",
        token.substring(0, 20) + "...",
      );

      // Check immediately after dispatch
      console.log(
        "[OTP] Redux token right after dispatch (via useSelector):",
        reduxToken ? "already updated?" : "not yet visible",
      );

      // Most reliable check — localStorage (assuming your slice saves it)
      setTimeout(() => {
        const lsToken = localStorage.getItem("token"); // ← change key if your slice uses different name
        console.log(
          "[OTP] localStorage 'token' after 400ms:",
          lsToken
            ? lsToken.substring(0, 20) + "..."
            : "NOT FOUND IN LOCALSTORAGE",
        );
      }, 400);

      // ─── JWT Decoding ───
      let decoded;
      try {
        decoded = jwtDecode(token);
        console.log("[OTP] Decoded JWT payload:", decoded);
      } catch (decodeErr) {
        console.error("[OTP] JWT decode failed:", decodeErr.message);
        throw decodeErr;
      }

      const role = (
        decoded?.role ||
        decoded?.userRole ||
        decoded?.type ||
        ""
      ).toUpperCase();
      console.log("[OTP] Extracted role:", role || "NO ROLE FOUND IN JWT");

      // Navigation decision
      console.log("[OTP] Deciding navigation based on role:", role);

      switch (role) {
        case "ADMIN":
          console.log("[OTP] → Navigating to /admin/dashboard");
          navigate("/admin/dashboard", { replace: true });
          break;
        case "INFLUENCER":
          console.log("[OTP] → Navigating to /influencer/dashboard");
          navigate("/influencer/dashboard", { replace: true });
          break;
        case "DRIVER":
          console.log("[OTP] → Navigating to /driver/dashboard");
          navigate("/driver/dashboard", { replace: true });
          break;
        case "SUBADMIN":
          console.log("[OTP] → Navigating to /subadmin/dashboard");
          navigate("/subadmin/dashboard", { replace: true });
          break;
        default:
          console.log("[OTP] → Unknown / missing role → Navigating to /");
          navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("[OTP] Verification failed:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID missing");
      await resendOtp(userId);
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setError("");
      console.log("[RESEND] OTP resent successfully");
    } catch (err) {
      console.error("[RESEND] Failed:", err);
      setError("Failed to resend OTP");
    }
  };

  // ────────────────────────────────────────────────
  // UI (unchanged)
  // ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-4">
            <img src={Khush} alt="Khush Logo" className="w-24 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">
              Verify Mobile Number
            </h1>
            <p className="text-gray-600 text-sm">
              Enter OTP sent to{" "}
              <span className="font-semibold">+91 {mobile}</span>
            </p>
          </div>

          <div className="flex justify-center gap-3 my-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-gray-600">
                Resend OTP in{" "}
                <span className="font-medium">
                  00:{timer.toString().padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-indigo-600 font-medium hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
