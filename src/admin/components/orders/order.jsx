// src/pages/admin/Orders.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getOrders,
  getSingleOrder,
  updateOrderItemStatus,
} from "../../apis/Orderapi"; // adjust path as needed

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
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  // Item pagination (inside single order view)
  const [itemPage, setItemPage] = useState(1);
  const itemLimit = 8;

  // ────────────────────────────────────────────────
  // Fetch list of orders
  // ────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getOrders(
        pagination.page,
        pagination.limit,
        search,
        statusFilter,
      );
      console.log("GET /admin/orders response:", res);

      const data = res?.data || {};
      setOrders(data.orders || data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages:
          data.totalPages ||
          Math.ceil((data.count || data.orders?.length || 0) / prev.limit),
      }));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ────────────────────────────────────────────────
  // Fetch one order + its items
  // ────────────────────────────────────────────────
  const fetchSingleOrder = async (orderId) => {
    if (!orderId) {
      console.warn("No orderId (_id) provided to fetchSingleOrder");
      return;
    }

    try {
      setOrderLoading(true);
      console.log(`Fetching single order ${orderId}, items page: ${itemPage}`);
      const res = await getSingleOrder(orderId, itemPage, itemLimit);
      console.log("GET /admin/orders/:id response:", res?.data);

      setSelectedOrder(res?.data || null);
    } catch (err) {
      console.error("Failed to load single order:", err?.response?.data || err);
      alert("Could not load order details. Check console for details.");
    } finally {
      setOrderLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  // Update individual item status
  // ────────────────────────────────────────────────
  const handleUpdateItemStatus = async (orderId, itemId, newStatus) => {
    try {
      const payload = { status: newStatus };
      const res = await updateOrderItemStatus(orderId, itemId, payload);
      console.log("PATCH item status response:", res);

      // Refresh current view
      await fetchSingleOrder(orderId);
    } catch (err) {
      console.error("Status update failed:", err?.response?.data || err);
      alert("Failed to update item status");
    }
  };

  // ────────────────────────────────────────────────
  // Improved Status badge
  // ────────────────────────────────────────────────
  const getStatusBadge = (status = "pending") => {
    const s = (status || "pending").toUpperCase();

    const statusStyles = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", Icon: Clock },
      PROCESSING: { bg: "bg-blue-100", text: "text-blue-100", Icon: RefreshCw },
      CONFIRMED: {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        Icon: RefreshCw,
      },
      SHIPPED: { bg: "bg-purple-100", text: "text-purple-800", Icon: Truck },
      DELIVERED: {
        bg: "bg-green-100",
        text: "text-green-800",
        Icon: CheckCircle,
      },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", Icon: XCircle },
    };

    const {
      bg = "bg-gray-100",
      text = "text-gray-800",
      Icon = Clock,
    } = statusStyles[s] || statusStyles.PENDING;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}
      >
        <Icon size={14} />
        {s.charAt(0) + s.slice(1).toLowerCase()}
      </span>
    );
  };

  const statusOptions = [
    "Pending",
    "Processing",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
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

        {!selectedOrder ? (
          /* ──────── Orders List Table ──────── */
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Order
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Customer
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Phone
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Items
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Total
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Date
                    </th>
                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center text-gray-500"
                      >
                        Loading orders…
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="break-words px-4 py-4 font-medium text-indigo-600">
                          #{order.orderId || order._id?.slice(-8).toUpperCase()}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.name || order.address?.name || "—"}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                          {order.user?.countryCode || ""}
                          {order.user?.phoneNumber ||
                            order.address?.phone ||
                            "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                          {order.totalItems ||
                            order.totalQuantity ||
                            order.items?.length ||
                            "?"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                          ₹
                          {(
                            order.totalAmount ||
                            order.pricing?.finalPayable ||
                            0
                          ).toLocaleString("en-IN")}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          {getStatusBadge(order.status || order.orderStatus)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-center">
                          <button
                            onClick={() => {
                              setItemPage(1);
                              fetchSingleOrder(order.orderId); // ← Key fix: use _id
                            }}
                            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* List Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{pagination.page}</span> of{" "}
                <span className="font-medium">
                  {pagination.totalPages || 1}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.max(1, p.page - 1),
                    }))
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page + 1 }))
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ──────── Single Order Detail View ──────── */
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b bg-gray-50 px-6 py-5">
              <button
                onClick={() => setSelectedOrder(null)}
                className="mb-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                ← Back to orders
              </button>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Order #
                  {selectedOrder.orderId ||
                    selectedOrder._id?.slice(-8).toUpperCase()}
                </h2>
                {getStatusBadge(
                  selectedOrder.status || selectedOrder.orderStatus,
                )}
              </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-2">
              {/* Customer & Address */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Customer & Delivery
                </h3>
                <div className="space-y-2.5 text-gray-700">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.userId?.name ||
                      selectedOrder.address?.name ||
                      "—"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.userId?.countryCode}
                    {selectedOrder.userId?.phoneNumber ||
                      selectedOrder.address?.phone ||
                      "—"}
                  </p>
                  <p>
                    <strong>Address:</strong>
                    <br />
                    {selectedOrder.address?.fullAddress ||
                      `${selectedOrder.address?.fullAddress || "—"}`}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Order Summary
                </h3>
                <div className="space-y-2.5 text-gray-700">
                  <p>
                    <strong>Placed:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                  </p>
                  <p>
                    <strong>Items:</strong>{" "}
                    {selectedOrder.totalQuantity ||
                      selectedOrder.items?.length ||
                      0}
                  </p>
                  <p>
                    <strong>Total:</strong>{" "}
                    <span className="text-lg font-bold text-gray-900">
                      ₹
                      {(
                        selectedOrder.pricing?.finalPayable ||
                        selectedOrder.totalAmount ||
                        0
                      ).toLocaleString("en-IN")}
                    </span>
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {selectedOrder.payment?.mode || "—"} •{" "}
                    {selectedOrder.payment?.status || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="px-6 pb-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Order Items
              </h3>

              {orderLoading ? (
                <div className="py-12 text-center text-gray-500">
                  Loading items…
                </div>
              ) : !selectedOrder.items?.length ? (
                <div className="py-12 text-center text-gray-500">
                  No items found
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Product
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Qty
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Price
                        </th>
                        <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Status
                        </th>
                        <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                          Change Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {selectedOrder.items.map((item) => (
                        <tr
                          key={item._id || item.itemId}
                          className="hover:bg-gray-50/60"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {item.variant?.imageUrl && (
                                <img
                                  src={item.variant.imageUrl}
                                  alt={item.sku || "Product"}
                                  className="h-12 w-12 rounded object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {item.sku || item.variant?.sku || "—"}
                                </div>
                                <div className="mt-0.5 text-xs text-gray-500">
                                  {item.variant?.color &&
                                    `Color: ${item.variant.color}`}
                                  {item.variant?.size &&
                                    ` • Size: ${item.variant.size}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                            ₹{(item.unitPrice || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-center">
                            <select
                              value={item.status || "Pending"}
                              onChange={(e) => {
                                if (
                                  window.confirm(
                                    `Update status to "${e.target.value}"?`,
                                  )
                                ) {
                                  handleUpdateItemStatus(
                                    selectedOrder._id,
                                    item._id || item.itemId,
                                    e.target.value,
                                  );
                                }
                              }}
                              className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                              {statusOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Item-level pagination */}
              {selectedOrder.itemsPagination?.total > itemLimit && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    disabled={itemPage <= 1}
                    onClick={() => {
                      setItemPage((p) => Math.max(1, p - 1));
                      fetchSingleOrder(selectedOrder._id);
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {itemPage} of{" "}
                    {selectedOrder.itemsPagination?.totalPages || 1}
                  </span>
                  <button
                    disabled={
                      itemPage >=
                      (selectedOrder.itemsPagination?.totalPages || 1)
                    }
                    onClick={() => {
                      setItemPage((p) => p + 1);
                      fetchSingleOrder(selectedOrder._id);
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
