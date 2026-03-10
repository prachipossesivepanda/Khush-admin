import { useNavigate } from "react-router-dom";

export default function ExchangeOrderDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tabs – header is in layout */}
      <div className="flex gap-3 px-4 pb-4">
        <button
          onClick={() => navigate("/driver/dashboard")}
          className="px-6 py-2 rounded-xl text-sm transition bg-white border border-gray-300 hover:bg-gray-50"
        >
          Orders
        </button>
        <button className="px-6 py-2 rounded-xl text-sm transition bg-black text-white">
          Exchange Orders
        </button>
      </div>

      {/* Empty state – no static data */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-gray-600 font-medium">No exchange order assigned</p>
        <p className="text-sm text-gray-500 mt-1">
          When an exchange order is assigned to you, it will appear here.
        </p>
      </div>
    </div>
  );
}