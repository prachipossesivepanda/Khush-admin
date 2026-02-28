// src/influencer/influencercomponents/common/sidebar.jsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  ShoppingBag,
  IndianRupee,
  UserCircle,
  Menu,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function InfluencerLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCouponsOpen, setIsCouponsOpen] = useState(false);

  const toggleCoupons = () => setIsCouponsOpen((prev) => !prev);

  const navItems = [
    { to: "/influencer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      label: "Coupons",
      icon: Ticket,
      hasSubmenu: true,
      isOpen: isCouponsOpen,
      onToggle: toggleCoupons,
      subItems: [
        { to: "/influencer/coupon", label: "All Coupons", icon: Ticket },
        { to: "/influencer/analytics", label: "Coupon Analytics", icon: BarChart3 },
      ],
    },
    { to: "/influencer/orders", label: "Orders", icon: ShoppingBag },
    { to: "/influencer/earnings", label: "Earnings", icon: IndianRupee },
    { to: "/influencer/profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 lg:w-80 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex-col shadow-2xl shadow-black/30 relative">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/40 ring-2 ring-white/20">
                K
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Khush</h2>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300/80 mt-0.5">
                Influencer Hub
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) =>
            item.hasSubmenu ? (
              <div key={item.label}>
                <button
                  onClick={item.onToggle}
                  className={`group w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    item.isOpen
                      ? "bg-indigo-600/20 text-white font-semibold shadow-md shadow-indigo-500/20 border border-indigo-500/30"
                      : "text-gray-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 transition-transform ${item.isOpen ? "scale-110" : "group-hover:scale-110"}`}
                      strokeWidth={item.isOpen ? 2.5 : 2}
                    />
                    <span className="text-sm font-medium tracking-wide">{item.label}</span>
                  </div>
                  {item.isOpen ? (
                    <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                  ) : (
                    <ChevronRight className="w-5 h-5 transition-transform duration-300" />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    item.isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-11 space-y-1 py-1">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                            isActive
                              ? "bg-indigo-500/20 text-indigo-300 font-medium"
                              : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <sub.icon
                              className="w-4 h-4"
                              strokeWidth={isActive ? 2.5 : 2}
                            />
                            {sub.label}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white font-semibold shadow-md shadow-indigo-500/25 border border-indigo-500/40"
                      : "text-gray-300 hover:bg-white/8 hover:text-white hover:shadow-sm"
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full">
                    <item.icon
                      className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className="text-sm font-medium tracking-wide">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                    )}
                  </div>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Logout */}
        <div className="p-5 border-t border-white/10 mt-auto">
          <button className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-700/30 to-rose-600/20 hover:from-rose-700/50 hover:to-rose-600/40 text-rose-200 hover:text-white transition-all duration-300 border border-rose-600/30 hover:border-rose-500/50 shadow-sm hover:shadow-lg">
            <LogOut className="w-5 h-5" />
            <span className="font-semibold tracking-wide">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-opacity-90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              K
            </div>
            <span className="font-bold text-lg text-gray-900">Khush</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </header>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-2xl transform transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Brand */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    K
                  </div>
                  <h2 className="text-xl font-bold">Khush</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Nav */}
              <nav className="px-3 py-6 space-y-2">
                {navItems.map((item) =>
                  item.hasSubmenu ? (
                    <div key={item.label}>
                      <button
                        onClick={item.onToggle}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        {item.isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>

                      {item.isOpen && (
                        <div className="pl-10 space-y-1 mt-1">
                          {item.subItems.map((sub) => (
                            <NavLink
                              key={sub.to}
                              to={sub.to}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `block px-4 py-2.5 rounded-lg text-sm ${
                                  isActive ? "bg-indigo-600/30 text-indigo-300" : "hover:bg-white/5"
                                }`
                              }
                            >
                              {sub.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                          isActive ? "bg-indigo-600/30 text-white" : "hover:bg-white/10"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                          {item.label}
                        </>
                      )}
                    </NavLink>
                  )
                )}

                {/* Mobile Logout */}
                <div className="pt-4 mt-4 border-t border-white/10">
                  <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 transition">
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-xl z-20 safe-area-bottom">
          <div className="flex justify-around items-center py-2 max-w-screen-sm mx-auto">
            {[
              { to: "/influencer/dashboard", icon: LayoutDashboard, label: "Home" },
              { to: "/influencer/coupon", icon: Ticket, label: "Coupons" },
              { to: "/influencer/orders", icon: ShoppingBag, label: "Orders" },
              { to: "/influencer/earnings", icon: IndianRupee, label: "Earnings" },
              { to: "/influencer/profile", icon: UserCircle, label: "Profile" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all min-w-[64px] ${
                    isActive ? "text-indigo-600 scale-105" : "text-gray-600 hover:text-indigo-500"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{item.label}</span>
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