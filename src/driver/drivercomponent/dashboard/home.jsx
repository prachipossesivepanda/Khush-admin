import { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyDeliveries, driverToggleOnline } from "../../apis/driverApi";

const STATUS_LABELS = {
  ASSIGNED: "New",
  ACCEPTED: "Accepted",
  PICKED_UP: "Picked up",
  OUT_FOR_DELIVERY: "Out for delivery",
};

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const dummyOrders = Array.from({ length: 20 }, (_, i) => i + 1);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await getMyDeliveries();
      const list = res?.data ?? res ?? [];
      setDeliveries(Array.isArray(list) ? list : []);
    } catch {
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleToggleAccepting = async () => {
    const next = !isAccepting;
    setToggleLoading(true);
    try {
      await driverToggleOnline(next);
      setIsAccepting(next);
    } catch {
      // keep current state on error
    } finally {
      setToggleLoading(false);
    }
  };

  const showApiList = activeTab === "orders" && !loading;
  const listToShow = showApiList ? deliveries : [];
  const hasApiCards = listToShow.length > 0;
  const showDummy = activeTab === "orders" && !hasApiCards && !loading;

  return (
    <div className="p-4 space-y-4 mt-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="bg-white px-7 py-2 rounded-xl shadow flex items-center gap-4">
            <span className="text-sm font-medium">
              {isAccepting ? "Accepting Pick-ups" : "Not Accepting"}
            </span>
            <div
              onClick={() => !toggleLoading && handleToggleAccepting()}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                isAccepting ? "bg-black" : "bg-gray-300"
              } ${toggleLoading ? "opacity-70" : ""}`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${
                  isAccepting ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-200 p-2 rounded-xl shadow cursor-pointer">🔔</div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-2 rounded-lg text-sm transition ${
            activeTab === "orders" ? "bg-black text-white" : "border border-black"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => navigate("/driver/exchange-orders")}
          className={`px-5 py-2 rounded-lg text-sm transition ${
            activeTab === "exchange" ? "bg-black text-white" : "border border-black"
          }`}
        >
          Exchange Orders
        </button>
      </div>

      {loading && activeTab === "orders" && (
        <div className="text-center text-gray-500 py-4">Loading deliveries…</div>
      )}

      {hasApiCards && (
        <div className="space-y-4">
          {listToShow.slice(0, visibleCount).map((a) => {
            const order = a?.order ?? {};
            const address = order?.address ?? {};
            const addrSnippet = address?.fullAddress?.split(",")[0] || address?.city || "—";
            const status = a?.status ?? "";
            const amount = a?.amountToCollect ?? 0;
            const paymentMode = a?.paymentMode ?? "COD";
            return (
              <div
                key={a._id}
                onClick={() => navigate(`/driver/assignment/${a._id}`)}
                className="bg-white rounded-2xl p-4 shadow-md cursor-pointer active:scale-95 transition-transform duration-150"
              >
                <h3 className="font-semibold mb-3">
                  {STATUS_LABELS[status] || status} · {order?.orderId || ""}
                </h3>
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <MapPin size={18} className="text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">{addrSnippet}</p>
                      <p className="text-sm text-gray-500">Order #{order?.orderId?.slice(-6) || a._id?.slice(-6)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{amount.toFixed(2)}</p>
                    <p className="text-sm font-semibold">{paymentMode}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{STATUS_LABELS[status] || status}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {listToShow.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((c) => c + 4)}
              className="w-full py-2 text-gray-500 text-sm"
            >
              Load more
            </button>
          )}
        </div>
      )}

      {showDummy && (
        <div className="space-y-4">
          {dummyOrders.slice(0, visibleCount).map((item) => (
            <div
              key={item}
              onClick={() => navigate("/driver/orderdetails")}
              className="bg-white rounded-2xl p-4 shadow-md cursor-pointer active:scale-95 transition-transform duration-150"
            >
              <h3 className="font-semibold mb-3">New Order!</h3>
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <MapPin size={18} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">GT Road, Ludhiana.</p>
                    <p className="text-sm text-gray-500">Item ID - #{12345687 + item}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">₹{(150 + item).toFixed(2)}</p>
                  <p className="text-sm font-semibold">{item % 2 === 0 ? "Online Payment" : "COD"}</p>
                </div>
              </div>
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
          {visibleCount < dummyOrders.length && (
            <div className="text-center text-gray-500 py-4">Loading more orders...</div>
          )}
        </div>
      )}
    </div>
  );
}
