import React from "react";
import logo from "../../../assets/images/khush.svg";
import bgPattern from "../../../assets/images/khushbackground.svg";
import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();
export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col ">
      
      {/* Top Section with Background Image */}
      <div
        className="flex-1 flex justify-center pt-20 bg-top bg-no-repeat"
        style={{
          backgroundImage: `url(${bgPattern})`,
          backgroundSize: "contain",
        }}
      >
        <img
          src={logo}
          alt="Khush Logo"
          className="w-52 object-contain"
        />
      </div>

      {/* Bottom Black Card (Longer) */}
      <div className="bg-black rounded-t-[60px] px-6 pt-10 pb-16 text-white">
        
        <label className="block text-sm mb-3">Mobile No.</label>

        <div className="bg-white  flex items-center px-3 py-3 text-black">
          <span className="mr-2 text-sm">+91</span>
          <input
            type="text"
            className="w-full outline-none bg-transparent text-sm"
          />
        </div>

        <div className="flex items-center mt-4">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm">Remember me</span>
        </div>

        <button 
         onClick={() => navigate("/driver/verify-otp")}
        className="w-full mt-8 bg-white text-black py-3 rounded-xl flex items-center justify-center gap-2 font-medium">
          Continue
          <span className="text-lg">›</span>
        </button>
      </div>
    </div>
  );
}