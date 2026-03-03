import { useState } from "react";
import { MapPin, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function DriverDashboard() {
  const [isAccepting, setIsAccepting] = useState(true);
  const [activeTab, setActiveTab] = useState("exchange");
 const navigate = useNavigate()
  const orders = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">

      {/* Top Section */}
      <div className="px-4 pt-6 pb-4 space-y-4">

        {/* Profile + Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 bg-gray-200 px-3 py-2 rounded-2xl w-full max-w-xs">
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />

            <span className="text-sm font-medium flex-1">
              Accepting Pick-ups
            </span>

            {/* Toggle */}
            <div
              onClick={() => setIsAccepting(!isAccepting)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                isAccepting ? "bg-black" : "bg-gray-400"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  isAccepting ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Bell */}
          <div className="ml-3 bg-gray-200 p-3 rounded-2xl">
            <Bell size={18} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          <button
    onClick={() => {
      setActiveTab("orders");
      navigate("/driver/dashboard");
    }}
    className={`px-6 py-2 rounded-xl text-sm transition ${
      activeTab === "orders"
        ? "bg-black text-white"
        : "bg-white border border-gray-300"
    }`}
  >
    Orders
  </button>

          <button
            onClick={() => setActiveTab("exchange")}
            className={`px-6 py-2 rounded-xl text-sm transition ${
              activeTab === "exchange"
                ? "bg-black text-white"
                : "bg-white border border-gray-300"
            }`}
          >
            Exchange Orders
          </button>
        </div>
      </div>

      {/* Scrollable Cards Section */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">

        {orders.map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl p-4 shadow-md"
          >
            <h3 className="font-medium text-gray-700 mb-3">
              {item % 2 === 0
                ? "Exchange Order Delivery!"
                : "Pickup Order!"}
            </h3>

            <div className="border-t border-gray-200 pt-3 flex gap-3">
              <MapPin size={18} className="text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-600">
                  GT Road, Ludhiana.
                </p>
                <p className="text-sm text-gray-500">
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