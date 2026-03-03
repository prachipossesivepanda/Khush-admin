import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function Otp() {
  const navigate =useNavigate()
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  return (
    <div className="relative min-h-screen bg-[#f2f2f2] flex flex-col items-center">
      
      {/* OTP Section */}
      <div
        className="flex flex-col items-center text-center mt-[124px]"
        style={{ width: "299px", gap: "32px" }}
      >
        <div>
          <h1 className="text-[28px] font-semibold">Verify OTP</h1>
          <p className="text-gray-600 text-sm mt-2">
            Enter the OTP sent to +91 ******333
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-between w-full">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-10 text-center text-2xl bg-transparent border-b border-gray-400 focus:border-black outline-none"
            />
          ))}
        </div>

        {/* Resend */}
        <div className="text-sm">
          <span className="text-gray-400">
            Didn't you receive the OTP?{" "}
          </span>
          <button className="text-black font-medium">
            Resend OTP
          </button>

          <div className="flex justify-center items-center gap-1 mt-3 text-gray-500 text-xs">
            ⏱ 00 : 45
          </div>
        </div>
      </div>

      {/* VERIFY OTP BUTTON (Exact Figma Position) */}
     <button
  onClick={() => navigate("/driver/dashboard")}
  className="absolute bottom-[82px] w-[343px] h-[56px] bg-black text-white rounded-lg py-4 px-6 tracking-wide"
>
  VERIFY OTP
</button>

    </div>
  );
}