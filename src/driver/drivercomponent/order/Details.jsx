// OrderDetails.jsx
import React from 'react';
import coat from "../../../assets/images/coat.svg"
export default function OrderDetails() {
  return (
    <div className="min-h-screen bg-white px-4 py-6 font-sans">
      {/* Header / Title bar */}
      <div className="flex items-center justify-between mb-6">
        <button className="text-gray-700 text-2xl">
          ←
        </button>
        <h1 className="text-xl font-semibold tracking-tight">ORDER DETAILS</h1>
        <div className="w-8"></div> {/* spacer for alignment */}
      </div>

      <div className="space-y-8">

        {/* Pickup Item */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-500">Pickup Item</div>
          
          <div className="text-base font-medium">
            LAMEREI knit cardigan
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {/* You can replace with real image */}
              <img 
                src={coat}
                alt="pink cardigan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm leading-tight">
              RECYCLE BOUCLE KNIT CARDIGAN<br />
              PINK<br />
              Replacement ITEM<br />
              LAMEREI<br />
              ITEM ID: #AS132ZA
            </div>
          </div>
        </div>

        {/* Replacement Item */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-500">Replacement ITEM</div>
          
          <div className="flex items-center gap-3">
            <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400"
                alt="pink cardigan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm leading-tight">
              LAMEREI<br />
              RECYCLE BOUCLE KNIT CARDIGAN<br />
              PINK<br />
              ITEM ID: #AS132ZA
            </div>
          </div>
        </div>

        {/* Delivered To */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">●</span>
            <span className="text-sm font-medium text-gray-500">DELIVERED TO</span>
          </div>

          <div className="text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>JOHN DOE</div>
            <div>606-372 ULLAMCOMPER STREET</div>
            <div>ROSEVILLE</div>
            <div>NH 11523</div>
            <div className="mt-1">786 713-8616</div>
          </div>
        </div>

      </div>
    </div>
  );
}