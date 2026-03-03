import React from "react";
import coat from "../../../assets/images/coat.svg"
export default function CashPayment() {
  return (
    <div className="w-[390px] h-[844px] bg-white mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-center relative h-14 border-b border-gray-200">
        <button className="absolute left-4 text-xl">&#8592;</button>
        <h1 className="text-sm tracking-widest font-semibold">
          CASH PAYMENT
        </h1>
      </div>

      {/* Content */}
      <div className="px-5 pt-6">
        <p className="text-xs tracking-widest text-gray-500 mb-4">
          CASH TO BE COLLECTED
        </p>

        {/* Product Card */}
        <div className="flex gap-4 pb-5 border-b border-gray-200">
          <img
            src={coat} // replace with your actual image path
            alt="product"
            className="w-20 h-24 object-cover"
          />

          <div className="flex flex-col justify-start">
            <p className="font-semibold tracking-widest text-sm mb-1">
              LAMEREI
            </p>
            <p className="text-xs text-gray-600 leading-4">
              RECYCLE BOUCLE KNIT CARDIGAN
              <br />
              PINK
            </p>
            <p className="text-xs text-gray-500 mt-2">
              ITEM ID &nbsp; <span className="font-medium">#AS123ZA</span>
            </p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center pt-5">
          <p className="text-sm font-medium">Total Amount</p>
          <p className="text-sm font-semibold">Rs150</p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-6 left-0 w-full px-5">
        <button className="w-full bg-black text-white py-4 text-sm tracking-widest rounded-md">
          CASH COLLECTED
        </button>
      </div>
    </div>
  );
}