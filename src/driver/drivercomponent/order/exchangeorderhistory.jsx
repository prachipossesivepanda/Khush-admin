import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function OrderHistory() {
    const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("exchange");

  const orders = [
    { id: 1, title: "Pickup Order!" },
    { id: 2, title: "Exchange Order Delivery!" },
    { id: 3, title: "Pickup Order!" },
    { id: 4, title: "Exchange Order Delivery!" },
    { id: 5, title: "Exchange Order Delivery!" },
  ];

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
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2 rounded-lg text-sm border transition ${
            activeTab === "orders"
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-400"
          }`}
        >
          Orders
        </button>

        <button
          onClick={() => setActiveTab("exchange")}
          className={`px-6 py-2 rounded-lg text-sm border transition ${
            activeTab === "exchange"
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-400"
          }`}
        >
          Exchange Orders
        </button>
      </div>

      {/* Scrollable Cards */}
      <div className="px-5 mt-6 space-y-5 overflow-y-auto pb-6">

        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/driver/deliveryhistory`)}
            className="bg-white rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          >
            {/* Title */}
            <p className="text-sm font-medium mb-3">
              {order.title}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-3"></div>

            {/* Location Row */}
            <div className="flex gap-3 items-start">
              <MapPin size={18} className="text-gray-500 mt-0.5" />

              <div>
                <p className="text-xs text-gray-600">
                  GT Road, Ludhiana.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Item ID - #12345687
                </p>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}