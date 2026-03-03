import React from "react";
import { MapPin, Clock } from "lucide-react";
 import { useNavigate } from "react-router-dom";
export default function OrderHistory() {
    const navigate = useNavigate();
  return (
    <div className="w-[390px] h-[844px] mx-auto bg-[#f2f2f2] border border-gray-200 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-center h-14 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-sm font-semibold tracking-widest">
          ORDER HISTORY
        </h1>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-3 px-5 mt-6 shrink-0">
        <button className="bg-black text-white px-6 py-2 rounded-lg text-sm">
          Orders
        </button>

        <button  onClick={() => navigate("/driver/exchangeorderdetails")}
         className="border border-black px-6 py-2 rounded-lg text-sm">
          Exchange Orders
        </button>
      </div>

      {/* Scrollable Orders List */}
      <div className="px-5 mt-6 space-y-5 overflow-y-auto pb-6">

        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl p-5 shadow-md"
          >
            {/* Title */}
            <p className="text-sm font-medium mb-4">
              New Order!
            </p>

            {/* Middle Row */}
            <div className="flex justify-between">

              {/* Left Section */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <MapPin size={18} className="text-gray-500" />
                  <div className="w-px h-12 border-l border-dashed border-gray-300 mt-1"></div>
                </div>

                <div>
                  <p className="text-xs text-gray-600">
                    GT Road, Ludhiana.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Item ID - #12345687
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-right">
                <p className="text-xs text-gray-600">
                  Rs150.50
                </p>
                <p className="text-xs font-semibold mt-1">
                  COD
                </p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-3 mt-5">
              <Clock size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">
                  Order Delivered
                </p>
                <p className="text-xs text-gray-700 font-medium">
                  01:10 PM
                </p>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}