// src/admin/components/Dashboard/Dashboard.jsx
import { ShoppingBag, Shirt, Users, Package, Layers, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import Khush from "../../../assets/images/logo.png";
const StatCard = ({ title, value, icon, trend, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-white p-4 sm:p-6 lg:p-7 shadow border border-gray-100
        hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 
        transition-all duration-300 ease-out
        overflow-hidden rounded-lg sm:rounded-xl
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 opacity-90"></div>

      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 truncate">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight break-words">
            {value}
          </p>
        </div>

        <div
          className={`
            flex-shrink-0 p-2 sm:p-3 lg:p-4 bg-gray-50 text-gray-700 
            group-hover:bg-gray-900 group-hover:text-white 
            transition-colors duration-300 rounded-lg
          `}
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
            {icon}
          </div>
        </div>
      </div>

      {trend && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm">
          <span
            className={`
              font-medium flex items-center gap-1
              ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}
            `}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-gray-500 hidden sm:inline">vs last month</span>
          <span className="text-gray-500 sm:hidden">vs last</span>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Categories",
      value: "28",
      icon: <Layers size={28} strokeWidth={1.8} />,
      trend: { value: "4", isPositive: true },
      route: "/admin/inventory/categories",
    },
    {
      title: "Subcategories",
      value: "94",
      icon: <Tag size={28} strokeWidth={1.8} />,
      trend: { value: "7", isPositive: true },
      route: "/admin/inventory/subcategories", // Navigate to categories to access subcategories
    },
    {
      title: "Total Products",
      value: "1,672",
      icon: <Shirt size={28} strokeWidth={1.8} />,
      trend: { value: "93", isPositive: true },
      route: "/admin/inventory/i", // Navigate to categories first to access products
    },
    {
      title: "Registered Users",
      value: "14,920",
      icon: <Users size={28} strokeWidth={1.8} />,
      trend: { value: "12%", isPositive: true },
      route: null, // No page available yet
    },
    {
      title: "Total Orders",
      value: "42,310",
      icon: <ShoppingBag size={28} strokeWidth={1.8} />,
      trend: { value: "3.8%", isPositive: false },
      route: null, // No page available yet
    },
    {
      title: "Pending Orders",
      value: "187",
      icon: <Package size={28} strokeWidth={1.8} />,
      route: null, // No page available yet
    },
  ];

  const handleCardClick = (route) => {
    if (route) {
      console.log("📊 Dashboard card clicked, navigating to:", route);
      navigate(route);
    } else {
      console.log("⚠️ No route defined for this card");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/70">
      {/* Header - stays visible above fold */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-start gap-3 sm:gap-4">
            {/* <img
              src={Khush}
              alt="Khush Logo"
              className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain"
            /> */}

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Khush Admin
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>

        {/* Future sections – recommended next additions */}
        {/* 
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow h-96">
            Recent Orders
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow h-96">
            Top Products / Revenue Chart
          </div>
        </div>
        */}
      </main>
    </div>
  );
};

export default Dashboard;