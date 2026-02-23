import React from "react";
import Khush from "../../../assets/images/khush.svg";
import { useNavigate } from "react-router-dom";

console.log("→ Login.jsx file has been imported / parsed");

export default function Login() {
  console.log("→ Login() function has started executing");

  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("→ Login component mounted");
    return () => {
      console.log("→ Login component unmounted");
    };
  }, []);

  const handleImageError = () => {
    console.error("→ Logo image FAILED to load. Path:", Khush);
  };

  console.log("→ About to return JSX");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      {/* Main centered BOX / CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Inner content with padding */}
        <div className="p-8 sm:p-10 space-y-8">
          {/* Logo & Title */}
          <div className="text-center space-y-5">
            <img
              src={Khush}
              alt="Khush Logo"
              className="w-24 sm:w-32 mx-auto drop-shadow-md transition-transform duration-500 hover:scale-105"
              onError={handleImageError}
              onLoad={() => console.log("→ Logo image successfully LOADED")}
            />
            {console.log("→ <img> logo JSX executed")}

            <h1 className="text-xl sm:text-xl font-bold text-gray-900">
              Welcome to Khush Influencer Panel
            </h1>
            {console.log("→ Welcome <h1> rendered")}

            {/* Uncomment if you want subtitle back */}
            {/* <p className="text-gray-600 text-base">
              Sign in to continue your journey
            </p> */}
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>

              <div className="flex rounded-xl overflow-hidden border border-gray-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 transition-all duration-200 bg-white">
                <span className="inline-flex items-center px-5 py-4 bg-gray-100 text-gray-700 font-medium text-sm border-r border-gray-300">
                  +91
                </span>

                <input
                  type="tel"
                  placeholder="Enter your number"
                  maxLength={10}
                  inputMode="numeric"
                  className="flex-1 bg-transparent px-4 py-4 text-gray-900 placeholder-gray-500 outline-none text-base caret-indigo-500"
                  onFocus={() => console.log("→ Input field focused")}
                />
                {console.log("→ Phone <input> rendered")}
              </div>
            </div>

            {/* Remember me (commented out) */}
            <div className="flex items-center gap-3 opacity-0 pointer-events-none">
              {/* <input type="checkbox" id="remember" className="w-5 h-5 ..." /> */}
              {console.log("→ Checkbox rendered (hidden)")}
              {/* <label ...>Keep me signed in</label> */}
              {console.log("→ Remember label rendered (hidden)")}
            </div>

            {/* Continue Button */}
            <button
              type="button"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl text-lg shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              onClick={() => {
                console.log("→ Continue button clicked");
                navigate("/influencer/verify-otp");
              }}
            >
              Continue →
            </button>
            {console.log("→ Continue button rendered")}

            {/* Terms */}
            <p className="text-center text-sm text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Terms
              </a>{" "}
              &{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Privacy
              </a>
            </p>
            {console.log("→ Terms & Privacy paragraph rendered")}
          </div>
        </div>
      </div>
    </div>
  );
}