import { MapPin, Clock, Send } from "lucide-react";
import productImage from "../../../assets/images/coat.svg";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
export default function OrderDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* Mobile Container */}
      <div className="w-[375px] bg-white flex flex-col">
        {/* ===== HEADER (Exact Spec) ===== */}
        {/* ===== HEADER ===== */}
        <div className="relative h-[64px] px-6 flex items-center border-b border-gray-300 bg-gray-100">
          <MdArrowBackIos
            size={22}
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />

          <h1 className="absolute right-6 text-[15px] font-bold tracking-[2.5px] uppercase">
            {" "}
            ORDER DETAILS
          </h1>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* Product Section */}
          <div className="flex gap-4">
            <img
              src={productImage}
              alt="product"
              className="w-[100px] h-[87px] object-cover "
            />

            <div>
              <p className="text-[12px] tracking-[2px] font-semibold">
                LAMEREI
              </p>

              <p className="text-[12px] text-gray-600 uppercase leading-4 mt-1">
                Recycled boucle knit cardigan pink
              </p>

              <p className="text-[12px] mt-3">
                ITEM ID : <span className="font-semibold">#AS123ZA</span>
              </p>
            </div>
          </div>

          <div className="border-b border-gray-300"></div>

          {/* Deliver To */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold">
              <MapPin size={14} />
              DELIVER TO
            </div>

            <div className="text-[12px] text-gray-700 space-y-1">
              <p className="font-semibold">JOHN DOE</p>
              <p>606-3727 ULLAMCORPER. STREET ROSEVILLE</p>
              <p>NH 11523</p>
              <p>(786) 713-8616</p>
            </div>

            {/* Get Direction */}
            <button className="w-full h-[48px] bg-black text-white rounded-xl flex items-center justify-center gap-2 text-[12px] font-semibold mt-4">
              GET DIRECTION
              <Send size={14} />
            </button>

            {/* Delivery Time */}
            <div className="flex items-center justify-center gap-2 text-[12px] text-gray-600 mt-2">
              <Clock size={14} />
              Delivery Time 01:45 PM
            </div>
          </div>

          <div className="border-b border-gray-300"></div>

          {/* Payment */}
          <div className="flex justify-between text-[16px] font-medium">
            <span>Cash On Delivery</span>
            <span>Rs150</span>
          </div>
        </div>

        {/* ===== Bottom Buttons ===== */}
        <div className="bg-white px-6 py-18 rounded-t-4xl shadow-inner space-y-4">
          <button
            onClick={() => navigate("/driver/exchange-orderdetails")}
          className="w-full h-[52px] bg-black text-white rounded-xl text-[14px] font-semibold">
            ITEM PICKED
          </button>

          <button 
          onClick={() => navigate("/driver/replacement")}
          className="w-full h-[52px] border border-gray-400 rounded-xl text-[14px] font-semibold">
            ITEM NOT PICKEDss
          </button>
        </div>
      </div>
    </div>
  );
}
