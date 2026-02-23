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
    <div className="min-h-screen bg-white flex flex-col">
      {console.log("→ Outer container <div> rendered")}

      {/* Top spacing + Logo – centered vertically */}
      <div className="flex-1 flex items-center justify-center p-6">
        {console.log("→ Top flex-1 section rendered")}

        <div className="text-center space-y-6">
          {console.log("→ Text-center wrapper rendered")}

          <img
            src={Khush}
            alt="Khush Logo"
            className="w-28 sm:w-36 mx-auto drop-shadow-xl transition-transform duration-500 hover:scale-110"
            onError={handleImageError}
            onLoad={() => console.log("→ Logo image successfully LOADED")}
          />
          {console.log("→ <img> logo JSX executed")}

          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">
            Welcome to Khush Driver Panel
          </h1>
          {console.log("→ Welcome <h1> rendered")}

          {/* <p className="text-gray-600 text-lg font-light">
            Sign in to continue your journey
          </p> */}
          {console.log("→ Subtitle <p> rendered")}
        </div>
      </div>

      {/* Bottom Card – clean white with light shadow */}
      <div className="bg-white border-t border-gray-200 shadow-2xl rounded-t-3xl">
        {console.log("→ Bottom card container rendered")}

        <div className="max-w-md mx-auto p-6 sm:p-8 space-y-6">
          {console.log("→ Inner max-w-md wrapper rendered")}

          {/* Mobile Number Label + Input */}
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

          {/* Remember me */}
          <div className="flex items-center gap-3">
            {/* <input
              type="checkbox"
              id="remember"
              className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            /> */}
            {console.log("→ Checkbox rendered")}

            {/* <label htmlFor="remember" className="text-sm text-gray-600">
              Keep me signed in
            </label> */}
            {console.log("→ Remember label rendered")}
          </div>

          {/* Clean black button */}
          <button
  type="button"
  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl text-lg shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
  onClick={() => {
    console.log("→ Continue button clicked");
    navigate("/driver/verify-otp");
  }}
>
  Continue →
</button>

          {/* Optional links */}
          <p className="text-center text-sm text-gray-500 mt-4">
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
  );
}