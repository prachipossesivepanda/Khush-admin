import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import coat from "../../../assets/images/coat.svg";

export default function OnlinePayment() {

  const amount = 150;
  const upiId = "shop@upi";
  const name = "Lamereiya";

  const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

  return (
    <div className="w-[390px] h-[844px] mx-auto bg-[#f2f2f2] relative border border-gray-200">
      
      {/* Header */}
      <div className="flex items-center justify-center relative h-14 bg-white border-b border-gray-200">
        <button className="absolute left-4 text-xl text-black">
          &#8592;
        </button>
        <h1 className="text-sm font-semibold tracking-widest">
          ONLINE PAYMENTsss
        </h1>
      </div>

      {/* Content */}
      <div className="px-5 pt-6">

        {/* Section Title */}
        <div className="border-b border-gray-300 pb-3 mb-4">
          <p className="text-xs tracking-widest text-gray-600">
            CASH TO BE COLLECTED
          </p>
        </div>

        {/* Product Row */}
        <div className="flex gap-4 pb-5">
          <img
            src={coat}
            alt="product"
            className="w-20 h-24 object-cover"
          />

          <div>
            <p className="font-semibold text-sm tracking-widest mb-1">
              LAMEREI
            </p>
            <p className="text-xs text-gray-600 leading-4">
              RECYCLE BOUCLE KNIT CARDIGAN
              <br />
              PINK
            </p>
            <p className="text-xs text-gray-500 mt-2">
              ITEM ID <span className="font-medium">#AS123ZA</span>
            </p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex justify-between items-center mt-4 mb-8">
          <p className="text-sm font-medium">Total Amount</p>
          <p className="text-sm font-semibold">Rs{amount}</p>
        </div>

        {/* QR Code Card */}
        <div className="bg-[#eaeaea] rounded-2xl p-6 flex justify-center items-center">
          <QRCodeCanvas
            value={upiLink}
            size={208}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Scan to pay with any UPI app
        </p>
      </div>
    </div>
  );
}