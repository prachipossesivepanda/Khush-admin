// src/components/DeliveryDashboard.jsx
import React, { useState } from 'react';
import { BellIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const mockOrders = [
  {
    id: "12345687",
    location: "GT Road, Ludhiana",
    amount: "150.50",
    itemId: "12345687",
    payment: "COD",
    orderTime: "01:10 PM",
    deliveryTime: "01:45 PM",
  },
  {
    id: "12345688",
    location: "GT Road, Ludhiana",
    amount: "150.50",
    itemId: "12345687",
    payment: "Online Payment",
    orderTime: "01:10 PM",
    deliveryTime: "01:45 PM",
  },
  {
    id: "12345689",
    location: "GT Road, Ludhiana",
    amount: "150.50",
    itemId: "12345687",
    payment: "Online Payment",
    orderTime: "01:10 PM",
    deliveryTime: "01:45 PM",
  },
];

export default function DeliveryDashboard() {
  const [acceptingPickups, setAcceptingPickups] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'exchange'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header / Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-800">Orders</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            <BellIcon className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      {/* Accepting Pick-ups Toggle */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Accepting Pick-ups
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={acceptingPickups}
              onChange={() => setAcceptingPickups(!acceptingPickups)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'orders'
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('exchange')}
            className={`px-5 py-2 text-sm font-medium rounded-md transition ${
              activeTab === 'exchange'
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Exchange Orders
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-5 space-y-4">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white  shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1 bg-indigo-600"></div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">New Order!</h3>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    order.payment === 'COD'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {order.payment}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">{order.location}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Item ID - #{order.itemId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" />
                    <span>Order Received • {order.orderTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" />
                    <span>Delivery • {order.deliveryTime}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{order.amount}
                  </span>
                  <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto flex justify-around py-2">
          <button className="flex flex-col items-center py-1 text-indigo-600">
            <span className="text-2xl">🏠</span>
            <span className="text-xs mt-0.5">Home</span>
          </button>
          <button className="flex flex-col items-center py-1 text-indigo-600">
            <span className="text-2xl">📦</span>
            <span className="text-xs mt-0.5">Orders</span>
          </button>
          <button className="flex flex-col items-center py-1 text-gray-500">
            <span className="text-2xl">👤</span>
            <span className="text-xs mt-0.5">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}