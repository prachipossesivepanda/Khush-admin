// src/pages/admin/Orders.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getOrders,
  getSingleOrder,
  updateOrderItemStatus,
} from "../../apis/Orderapi";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw,
  Eye,
  AlertCircle,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [itemPage, setItemPage] = useState(1);
  const itemLimit = 8;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOrders(
        pagination.page,
        pagination.limit,
        search,
        statusFilter
      );
      const data = res?.data || {};
      setOrders(data.orders || data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || Math.ceil((data.count || data.orders?.length || 0) / prev.limit),
      }));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err?.response?.data?.message || "Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchSingleOrder = async (orderId) => {
    if (!orderId) return;
    try {
      setOrderLoading(true);
      setOrderError(null);
      const res = await getSingleOrder(orderId, itemPage, itemLimit);
      setSelectedOrder(res?.data || null);
    } catch (err) {
      console.error("Failed to load order:", err);
      setOrderError(err?.response?.data?.message || "Could not load order details.");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleUpdateItemStatus = async (orderId, itemId, newStatus) => {
    if (!orderId || !itemId || !newStatus) return;

    const stringItemId = String(itemId);
    setUpdatingItemId(stringItemId);

    const prevItem = selectedOrder?.items?.find(
      (it) => String(it.itemId || it._id) === stringItemId
    );
    const prevStatus = prevItem?.status;

    setSelectedOrder((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((it) =>
          String(it.itemId || it._id) === stringItemId
            ? { ...it, status: newStatus }
            : it
        ),
      };
    });

    try {
      const payload = { status: newStatus };
      await updateOrderItemStatus(orderId, itemId, payload);
    } catch (err) {
      console.error("Status update failed:", err);
      const msg = err?.response?.data?.message || "Failed to update item status.";
      alert(msg);

      if (prevStatus) {
        setSelectedOrder((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((it) =>
              String(it.itemId || it._id) === stringItemId
                ? { ...it, status: prevStatus }
                : it
            ),
          };
        });
      }
    } finally {
      setUpdatingItemId(null);
    }
  };

  const getStatusBadge = (status = "pending") => {
    let s = (status || "pending")
      .toUpperCase()
      .replace(/_/g, " ")           // exchange_requested → EXCHANGE REQUESTED
      .trim();

    const statusStyles = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", Icon: Clock },
      PROCESSING: { bg: "bg-blue-100", text: "text-blue-800", Icon: RefreshCw },
      CONFIRMED: { bg: "bg-indigo-100", text: "text-indigo-800", Icon: RefreshCw },
      SHIPPED: { bg: "bg-purple-100", text: "text-purple-800", Icon: Truck },
      DELIVERED: { bg: "bg-green-100", text: "text-green-800", Icon: CheckCircle },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", Icon: XCircle },
      "OUT FOR DELIVERY": { bg: "bg-cyan-100", text: "text-cyan-800", Icon: Truck },
      "EXCHANGE REQUESTED": { bg: "bg-orange-100", text: "text-orange-800", Icon: RefreshCw },
      "EXCHANGE APPROVED": { bg: "bg-teal-100", text: "text-teal-800", Icon: CheckCircle },
      "EXCHANGE REJECTED": { bg: "bg-pink-100", text: "text-pink-800", Icon: XCircle },
      "EXCHANGE PICKUP SCHEDULED": { bg: "bg-amber-100", text: "text-amber-800", Icon: Truck },
      // Add more as needed
    };

    const { bg = "bg-gray-100", text = "text-gray-800", Icon = Clock } =
      statusStyles[s] || statusStyles.PENDING;

    // Shorten very long statuses for better display
    let displayText = s.charAt(0) + s.slice(1).toLowerCase();
    if (displayText.length > 24) {
      displayText = displayText
        .replace("Exchange ", "Ex. ")
        .replace("Pickup Scheduled", "Pickup Sch.")
        .replace("Out For Delivery", "Out for Del.");
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium ${bg} ${text} max-w-full truncate`}
      >
        <Icon size={14} />
        {displayText}
      </span>
    );
  };

  const statusOptions = [
    "Pending",
    "Processing",
    "Confirmed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
    "Cancelled",
    "Exchange Requested",
    "Exchange Approved",
    "Exchange Rejected",
    "Exchange Pickup Scheduled",
    "Exchange Picked",
    "Exchange Received",
    "Exchange Processing",
    "Exchange Shipped",
    "Exchange Delivered",
    "Exchange Completed",
  ];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header + Search */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl flex items-center gap-3">
            <Package className="h-8 w-8 text-indigo-600" />
            Order Management
          </h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="w-full rounded-lg border border-gray-300 pl-10 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {!selectedOrder ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Order</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Customer</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Phone</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Items</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Total</th>
                  <th className="px-4 py-4 min-w-[160px] text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Date</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-500">
                      Loading orders…
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="break-words px-4 py-4 font-medium text-indigo-600">
                        #{order.orderId || order._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || order.address?.name || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {order.user?.countryCode || ""}
                        {order.user?.phoneNumber || order.address?.phone || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {order.totalItems || order.totalQuantity || order.items?.length || "?"}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        ₹{(order.totalAmount || order.pricing?.finalPayable || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-4 min-w-[160px]">
                        {getStatusBadge(order.status || order.orderStatus)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => {
                            const customOrderId = order.orderId;
                            if (!customOrderId) {
                              setError("Order is missing valid orderId");
                              return;
                            }
                            setItemPage(1);
                            fetchSingleOrder(customOrderId);
                          }}
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition"
                          title="View order details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{pagination.page}</span> of{" "}
                <span className="font-medium">{pagination.totalPages || 1}</span>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages || loading}
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Single Order View */
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b bg-gray-50 px-6 py-5">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setOrderError(null);
                }}
                className="mb-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                ← Back to orders
              </button>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Order #{selectedOrder.orderId}
                </h2>
                {getStatusBadge(selectedOrder.status || selectedOrder.orderStatus)}
              </div>
            </div>

            {orderError && (
              <div className="mx-6 mt-4 rounded-lg bg-red-50 p-4 text-red-700 flex items-center gap-2">
                <AlertCircle size={20} />
                {orderError}
              </div>
            )}

            <div className="px-6 pb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Order Items</h3>

              {orderLoading ? (
                <div className="py-12 text-center text-gray-500">Loading items…</div>
              ) : !selectedOrder?.items?.length ? (
                <div className="py-12 text-center text-gray-500">No items found</div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Qty</th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Price</th>
                        <th className="px-5 py-3.5 min-w-[160px] text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">Change Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {selectedOrder.items.map((item) => {
                        const itemId = String(item.itemId || item._id);
                        const isUpdating = updatingItemId === itemId;

                        return (
                          <tr key={itemId} className="hover:bg-gray-50/60">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {item.variant?.imageUrl && (
                                  <img
                                    src={item.variant.imageUrl}
                                    alt={item.sku}
                                    className="h-12 w-12 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {item.sku || item.variant?.sku || "—"}
                                  </div>
                                  <div className="mt-0.5 text-xs text-gray-500">
                                    {item.variant?.color && `Color: ${item.variant.color}`}
                                    {item.variant?.size && ` • Size: ${item.variant.size}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-5 py-4 text-gray-700">{item.quantity}</td>
                            <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                              ₹{(item.unitPrice || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="px-5 py-4 min-w-[160px]">
                              {getStatusBadge(item.status)}
                            </td>
                            <td className="whitespace-nowrap px-5 py-4 text-center">
                              <div className="relative inline-block">
                                <select
                                  value={item.status || "Pending"}
                                  onChange={(e) => {
                                    const newVal = e.target.value;
                                    if (window.confirm(`Update to "${newVal}"?`)) {
                                      handleUpdateItemStatus(selectedOrder.orderId, itemId, newVal);
                                    }
                                  }}
                                  disabled={isUpdating}
                                  className={`rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                    isUpdating ? "opacity-60 cursor-wait" : ""
                                  }`}
                                >
                                  {statusOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>

                                {isUpdating && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded">
                                    <RefreshCw size={16} className="animate-spin text-indigo-600" />
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedOrder?.itemsPagination?.total > itemLimit && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    disabled={itemPage <= 1 || orderLoading}
                    onClick={() => {
                      setItemPage((p) => Math.max(1, p - 1));
                      fetchSingleOrder(selectedOrder.orderId);
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {itemPage} of {selectedOrder.itemsPagination?.totalPages || 1}
                  </span>
                  <button
                    disabled={itemPage >= (selectedOrder.itemsPagination?.totalPages || 1) || orderLoading}
                    onClick={() => {
                      setItemPage((p) => p + 1);
                      fetchSingleOrder(selectedOrder.orderId);
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;