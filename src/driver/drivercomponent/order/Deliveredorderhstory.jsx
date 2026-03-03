import React from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import coat from "../../../assets/images/coat.svg";

export default function OrderDetails() {
  return (
    <div className="w-[390px] h-[844px] mx-auto bg-[#f2f2f2] border border-gray-200 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-center relative h-14 bg-white border-b border-gray-300">
        <button className="absolute left-4">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-semibold tracking-widest">
          ORDER DETAILS
        </h1>
      </div>

      {/* Content */}
      <div className="bg-white">

        {/* Product Section */}
        <div className="flex gap-4 p-5 border-b border-gray-200">
          <img
            src={coat}
            alt="product"
            className="w-20 h-24 object-cover"
          />

          <div>
            <p className="text-sm font-semibold tracking-widest mb-1">
              LAMEREI
            </p>
            <p className="text-xs text-gray-600 leading-4">
              RECYCLE BOUCLE KNIT CARDIGAN
              <br />
              PINK
            </p>
            <p className="text-xs text-gray-500 mt-2">
              ITEM ID : <span className="font-medium">#AS123ZA</span>
            </p>
          </div>
        </div>

        {/* Delivered To Section */}
        <div className="p-5 border-b border-gray-200">

          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} />
            <p className="text-xs font-semibold tracking-wide">
              DELIVERED TO
            </p>
          </div>

          <p className="text-sm font-medium mb-1">
            JOHN DOE
          </p>

          <p className="text-xs text-gray-600 leading-5">
            606-3727 ULLAMCORPER. STREET ROSEVILLE
            <br />
            NH 11523
          </p>

          <p className="text-xs text-gray-600 mt-2">
            (786) 713-8616
          </p>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center p-5">
          <p className="text-sm font-medium">
            Total Amount
          </p>

          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">
              Rs150
            </p>
            <span className="text-xs text-gray-500">
              (COD)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}