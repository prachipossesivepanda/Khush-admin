import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, Send } from "lucide-react";
import { MdArrowBackIos } from "react-icons/md";
import {
  getMyDeliveries,
  acceptDelivery,
  rejectDelivery,
  markPickup,
  markOutForDelivery,
  markDelivered,
} from "../../apis/driverApi";

const STATUS_LABELS = {
  ASSIGNED: "New assignment",
  ACCEPTED: "Accepted",
  PICKED_UP: "Picked up",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
};

export default function AssignmentDetails() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyDeliveries();
        const list = res?.data ?? res ?? [];
        const found = Array.isArray(list) ? list.find((a) => String(a._id) === String(assignmentId)) : null;
        if (!cancelled) {
          setAssignment(found || null);
          if (!found && list.length >= 0) setError("Assignment not found.");
        }
      } catch (err) {
        if (!cancelled) {
          setError(typeof err === "string" ? err : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [assignmentId]);

  const runAction = async (fn) => {
    if (!assignmentId) return;
    setActionLoading(true);
    setError("");
    try {
      await fn(assignmentId);
      const res = await getMyDeliveries();
      const list = res?.data ?? res ?? [];
      const updated = Array.isArray(list) ? list.find((a) => String(a._id) === String(assignmentId)) : null;
      setAssignment(updated || null);
    } catch (err) {
      setError(typeof err === "string" ? err : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate("/driver/dashboard")} className="px-6 py-2 bg-black text-white rounded-xl">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const order = assignment?.order ?? {};
  const address = order?.address ?? {};
  const payment = order?.payment ?? {};
  const items = assignment?.items ?? [];
  const status = assignment?.status ?? "";
  const amountToCollect = assignment?.amountToCollect ?? 0;
  const paymentMode = assignment?.paymentMode ?? "COD";

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[375px] bg-white flex flex-col">
        <div className="relative h-[64px] px-6 flex items-center border-b border-gray-300 bg-gray-100">
          <MdArrowBackIos size={22} className="cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold tracking-[2.5px] uppercase">
            ASSIGNMENT
          </h1>
          <button
            onClick={() => navigate("/driver/dashboard")}
            className="absolute right-4 text-sm font-medium text-gray-700"
          >
            Dashboard
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <p className="text-sm font-medium text-gray-600">{STATUS_LABELS[status] || status}</p>

          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <img
                src={item?.variant?.imageUrl || "https://picsum.photos/100/87"}
                alt=""
                className="w-[100px] h-[87px] object-cover rounded"
              />
              <div>
                <p className="text-[12px] text-gray-600">
                  SKU: {item?.sku}
                </p>
                <p className="text-[12px] mt-1">Qty: {item?.quantity ?? 1}</p>
                <p className="text-sm font-medium mt-1">₹{((item?.unitPrice ?? 0) * (item?.quantity ?? 1)).toFixed(2)}</p>
              </div>
            </div>
          ))}

          <div className="border-b border-gray-300" />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold">
              <MapPin size={14} />
              DELIVER TO
            </div>
            <div className="text-[12px] text-gray-700 space-y-1">
              <p className="font-semibold">{address?.name || "—"}</p>
              <p>{address?.fullAddress || "—"}</p>
              <p>{address?.pincode} {address?.city} {address?.state}</p>
              <p>{address?.phone}</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address?.fullAddress || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[48px] bg-black text-white rounded-xl flex items-center justify-center gap-2 text-[12px] font-semibold mt-4"
            >
              GET DIRECTION
              <Send size={14} />
            </a>
          </div>

          <div className="border-b border-gray-300" />

          <div className="flex justify-between text-[16px] font-medium">
            <span>{paymentMode === "COD" ? "Cash to collect" : "Prepaid"}</span>
            <span>₹{amountToCollect.toFixed(2)}</span>
          </div>
        </div>

        {error && <p className="px-6 text-sm text-red-600">{error}</p>}

        <div className="bg-white px-6 py-4 space-y-3 border-t">
          {status === "ASSIGNED" && (
            <>
              <button
                onClick={() => runAction(acceptDelivery)}
                disabled={actionLoading}
                className="w-full h-[52px] bg-black text-white rounded-xl text-[14px] font-semibold disabled:opacity-70"
              >
                {actionLoading ? "…" : "Accept"}
              </button>
              <button
                onClick={() => runAction(rejectDelivery)}
                disabled={actionLoading}
                className="w-full h-[52px] border border-gray-400 rounded-xl text-[14px] font-semibold disabled:opacity-70"
              >
                Reject
              </button>
            </>
          )}
          {(status === "ACCEPTED" || status === "ASSIGNED") && (
            <button
              onClick={() => runAction(markPickup)}
              disabled={actionLoading}
              className="w-full h-[52px] bg-black text-white rounded-xl text-[14px] font-semibold disabled:opacity-70"
            >
              {actionLoading ? "…" : "Mark Pickup"}
            </button>
          )}
          {status === "PICKED_UP" && (
            <button
              onClick={() => runAction(markOutForDelivery)}
              disabled={actionLoading}
              className="w-full h-[52px] bg-black text-white rounded-xl text-[14px] font-semibold disabled:opacity-70"
            >
              {actionLoading ? "…" : "Out for Delivery"}
            </button>
          )}
          {status === "OUT_FOR_DELIVERY" && (
            <button
              onClick={() => runAction(markDelivered)}
              disabled={actionLoading}
              className="w-full h-[52px] bg-black text-white rounded-xl text-[14px] font-semibold disabled:opacity-70"
            >
              {actionLoading ? "…" : "Mark Delivered"}
            </button>
          )}
          {(status === "DELIVERED" || status === "REJECTED" || status === "CANCELLED") && (
            <p className="text-center text-gray-500 text-sm">No actions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
