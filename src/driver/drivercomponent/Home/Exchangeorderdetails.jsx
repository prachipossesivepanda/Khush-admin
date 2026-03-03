// OrderDetailsReplacement.jsx
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { MapPin, SendHorizontal } from "lucide-react";

// Replace with your actual image import path
import productImage from "../../../assets/images/coat.svg"; // ← your image

export default function OrderDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* Mobile frame simulation */}
      <div className="w-full max-w-[375px] bg-white flex flex-col min-h-screen relative">
        {/* Header */}
        <div className="relative h-[56px] px-4 flex items-center border-b border-gray-200">
          <button onClick={() => navigate(-1)}>
            <MdArrowBackIos size={20} className="text-black" />
          </button>

          <h1 className="absolute right-6 text-[15px] font-bold tracking-[2.5px] uppercase">
            ORDER DETAILS
          </h1>
        </div>

        {/* Main content - scrollable */}
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-36">
          {/* Title - REPLACEMENT ITEM */}
          <h2 className="text-[15px] font-semibold mb-4">REPLACEMENT ITEM</h2>

          {/* Product card */}
          <div className="flex gap-3 mb-6">
            <div className="w-[94px] h-[94px] flex-shrink-0  overflow-hidden border border-gray-200">
              <img
                src={productImage}
                alt="LAMEREI Recycle Boucle Knit Cardigan Pink"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-[13px] font-semibold tracking-wide">LAMEREI</p>
              <p className="text-[13px] text-gray-700 mt-0.5 leading-tight uppercase">
                RECYCLE BOUCLE KNIT CARDIGAN PINK
              </p>
              <p className="text-[12px] text-gray-600 mt-2">
                ITEM ID : <span className="font-medium">#AS123ZA</span>
              </p>
            </div>
          </div>

          {/* Deliver to section */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold">
              <MapPin size={16} className="text-black" strokeWidth={2.5} />
              DELIVER TO
            </div>

            <div className="text-[13px] leading-relaxed text-gray-800 space-y-0.5">
              <p className="font-semibold">JOHN</p>
              <p>606-3727 ULLAMCORPER. STREET ROSEVILLE</p>
              <p>NH 11523</p>
              <p>(786) 713-88618</p>
            </div>

            {/* Get Direction Button */}
            <button className="w-full h-[46px] mt-2 bg-black text-white rounded-xl flex items-center justify-center gap-2 text-[13px] font-medium tracking-wide active:opacity-90">
              GET DIRECTION
              <SendHorizontal size={15} strokeWidth={2.5} />
            </button>
          </div>

          {/* Bottom action buttons - fixed position */}
          <div className="fixed bottom-0 left-0 right-0 max-w-[375px] mx-auto bg-white px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 border-t border-gray-100 shadow-[0_-3px_10px_rgba(0,0,0,0.06)]">
            <div className="space-y-3">
              <button className="w-full h-[52px] bg-black text-white rounded-2xl text-[15px] font-semibold tracking-wide active:opacity-90 transition">
                ITEM DELIVERED
              </button>

              <button className="w-full h-[52px] border border-gray-400 text-gray-900 rounded-2xl text-[15px] font-semibold tracking-wide active:bg-gray-50 transition">
                ITEM NOT DELIVERED
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}