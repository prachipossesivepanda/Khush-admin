import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  IndianRupee,
  UserCircle,
  Menu,
  LogOut,
} from "lucide-react";

export default function InfluencerLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 lg:w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex-col shadow-[4px_0_24px_rgba(0,0,0,0.12)] relative overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        {/* Brand Section */}
        <div className="relative p-6 border-b border-white/10 backdrop-blur-sm bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30 ring-2 ring-white/20">
                K
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 shadow-lg"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Khush
              </h2>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mt-0.5">Influencer Portal</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 relative z-10">
          {[
            { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { to: "coupon", label: "Coupon", icon: LayoutDashboard },
            { to: "orders", label: "Orders", icon: ShoppingBag },
            { to: "earnings", label: "Earnings", icon: IndianRupee },
            { to: "profile", label: "Profile", icon: UserCircle },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ease-out
                 ${isActive
                   ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white font-semibold shadow-lg shadow-indigo-500/20 border border-indigo-500/30 backdrop-blur-sm"
                   : "text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-md hover:scale-[1.02]"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full shadow-lg shadow-indigo-400/50"></div>
                  )}
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm font-medium tracking-wide">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50 animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="relative p-6 border-t border-white/10 backdrop-blur-sm bg-gradient-to-r from-transparent to-white/5 mt-auto z-10">
          <button className="group w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600/30 hover:to-rose-600/30 text-red-300 hover:text-red-100 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/20 backdrop-blur-sm">
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-semibold text-sm tracking-wide">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/30">
                K
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900">Khush</span>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Influencer</p>
            </div>
          </div>
          <button className="p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 active:scale-95">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-transparent overflow-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] z-50 safe-area-bottom">
          <div className="flex justify-around items-center py-2.5 px-2 max-w-screen-sm mx-auto">
            {[
              { to: "dashboard", label: "Home", icon: LayoutDashboard },
              { to: "coupon", label: "Coupon", icon: LayoutDashboard },
              { to: "orders", label: "Orders", icon: ShoppingBag },
              { to: "earnings", label: "Earnings", icon: IndianRupee },
              { to: "profile", label: "Profile", icon: UserCircle },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300 min-w-[60px] group
                   ${isActive 
                     ? "text-indigo-600 scale-105" 
                     : "text-gray-500 hover:text-indigo-500 active:scale-95"
                   }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/50"></div>
                    )}
                    <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md shadow-indigo-500/20" 
                        : "group-hover:bg-gray-100"
                    }`}>
                      <item.icon
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
                      isActive ? "text-indigo-600" : "text-gray-500"
                    }`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}