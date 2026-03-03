import { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function DriverDashboard() {
  const [isAccepting, setIsAccepting] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();
  // Dummy orders data
  const orders = Array.from({ length: 20 }, (_, i) => i + 1);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setVisibleCount((prev) => prev + 4);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="p-4 space-y-4 mt-8  min-h-screen">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />

          {/* Accepting Pickups Toggle */}
          <div className="bg-white px-7 py-2 rounded-xl shadow flex items-center gap-4">
            <span className="text-sm font-medium">
              {isAccepting ? "Accepting Pick-ups" : "Not Accepting"}
            </span>

            <div
              onClick={() => setIsAccepting(!isAccepting)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isAccepting ? "bg-black" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${
                  isAccepting ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-200 p-2 rounded-xl shadow cursor-pointer">
          🔔
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2 rounded-lg text-sm transition ${
            activeTab === "orders"
              ? "bg-black text-white"
              : "border border-black"
          }`}
        >
          Orders
        </button>

        <button
          onClick={() => navigate("/driver/exchange-orders")}
          className={`px-5 py-2 rounded-lg text-sm transition ${
            activeTab === "exchange"
              ? "bg-black text-white"
              : "border border-black"
          }`}
        >
          Exchange Orders
        </button>
      </div>

      {/* Orders Cards */}
      <div className="space-y-4">
        {orders.slice(0, visibleCount).map((item) => (
<div
  key={item}
  onClick={() => navigate(`/driver/orderdetails`)}
  className="bg-white rounded-2xl p-4 shadow-md cursor-pointer active:scale-95 transition-transform duration-150"
>            <h3 className="font-semibold mb-3">
              {activeTab === "orders" ? "New Order!" : "Exchange Request!"}
            </h3>

            <div className="flex justify-between">
              {/* Left */}
              <div className="flex gap-3">
                <MapPin size={18} className="text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">GT Road, Ludhiana.</p>
                  <p className="text-sm text-gray-500">
                    Item ID - #{12345687 + item}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-sm font-medium">
                  ₹{(150 + item).toFixed(2)}
                </p>
                <p className="text-sm font-semibold">
                  {item % 2 === 0 ? "Online Payment" : "COD"}
                </p>
              </div>
            </div>

            {/* Time Section */}
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <div>
                  <p className="text-xs">Order Received</p>
                  <p>01:10 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />
                <div>
                  <p className="text-xs">Delivery Time</p>
                  <p>01:45 PM</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {visibleCount < orders.length && (
        <div className="text-center text-gray-500 py-4">
          Loading more orders...
        </div>
      )}
    </div>
  );
}
