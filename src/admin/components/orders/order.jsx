// src/pages/admin/Orders.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getOrders,
  getSingleOrder,
  updateOrderItemStatus,
  updateWholeOrderStatus,
  getAssignmentView,
  assignItems,
  assignWholeOrder,
  listDeliveryAgents,
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
  User,
  CreditCard,
  MapPin,
  DollarSign,
  ShoppingBag,
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
  const [updatingWholeOrder, setUpdatingWholeOrder] = useState(false);
  const [wholeOrderNewStatus, setWholeOrderNewStatus] = useState("");
  const [itemPage, setItemPage] = useState(1);
  const itemLimit = 8;
  // Multi-select items for bulk status update
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [updatingBulk, setUpdatingBulk] = useState(false);
  // Delivery assignment modal
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentOrderId, setAssignmentOrderId] = useState(null);
  const [assignmentMode, setAssignmentMode] = useState("whole");
  const [assignmentItemIds, setAssignmentItemIds] = useState([]);
  const [assignmentItemId, setAssignmentItemId] = useState(null);
  const [pendingNewStatus, setPendingNewStatus] = useState(null);
  const [deliveryAgentsList, setDeliveryAgentsList] = useState([]);
  const [selectedDeliveryAgentId, setSelectedDeliveryAgentId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);

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

  const STATUS_REQUIRES_ASSIGNMENT = ["SHIPPED", "OUT_FOR_DELIVERY"];
  const WHOLE_ORDER_SENTINEL = "WHOLE_ORDER";

  const isItemAssigned = (assignments, itemId) => {
    if (!Array.isArray(assignments) || !itemId) return false;
    const idStr = String(itemId);
    return assignments.some(
      (a) =>
        !["CANCELLED", "REJECTED", "DELIVERED"].includes(a.status) &&
        (a.itemIds || []).some((id) => String(id?._id ?? id) === idStr)
    );
  };

  const openAssignmentModal = (orderId, itemIdsOrWhole, newStatus) => {
    setAssignmentOrderId(orderId);
    setPendingNewStatus(newStatus);
    setSelectedDeliveryAgentId("");
    setAssignError(null);
    if (itemIdsOrWhole === WHOLE_ORDER_SENTINEL) {
      setAssignmentMode("whole");
      setAssignmentItemIds([]);
      setAssignmentItemId(WHOLE_ORDER_SENTINEL);
    } else if (Array.isArray(itemIdsOrWhole)) {
      setAssignmentMode("items");
      setAssignmentItemIds(itemIdsOrWhole.map(String));
      setAssignmentItemId(null);
    } else {
      setAssignmentMode("items");
      setAssignmentItemIds([String(itemIdsOrWhole)]);
      setAssignmentItemId(itemIdsOrWhole);
    }
    setAssignmentModalOpen(true);
    listDeliveryAgents(1, 100)
      .then((res) => {
        const data = res?.data || res;
        const list = data?.deliveryAgents ?? data?.data ?? [];
        setDeliveryAgentsList(Array.isArray(list) ? list : []);
      })
      .catch(() => setDeliveryAgentsList([]));
  };

  const handleAssignmentSubmit = async () => {
    if (!assignmentOrderId || !pendingNewStatus || !selectedDeliveryAgentId) {
      setAssignError("Please select a delivery agent.");
      return;
    }
    if (assignmentMode === "items" && assignmentItemIds.length === 0) {
      setAssignError("No items to assign.");
      return;
    }
    setAssignLoading(true);
    setAssignError(null);
    try {
      if (assignmentMode === "whole") {
        await assignWholeOrder(assignmentOrderId, selectedDeliveryAgentId);
        await updateWholeOrderStatus(assignmentOrderId, { status: pendingNewStatus });
      } else {
        await assignItems(assignmentOrderId, selectedDeliveryAgentId, assignmentItemIds);
        for (const itemId of assignmentItemIds) {
          await updateOrderItemStatus(assignmentOrderId, itemId, { status: pendingNewStatus });
        }
      }
      setAssignmentModalOpen(false);
      setWholeOrderNewStatus("");
      setSelectedItemIds([]);
      setBulkStatus("");
      fetchSingleOrder(assignmentOrderId);
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.response?.data?.message || "Assign failed.";
      setAssignError(msg);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUpdateWholeOrderStatus = async () => {
    if (!selectedOrder?.orderId || !wholeOrderNewStatus) return;
    const label = statusOptions.find((o) => o.value === wholeOrderNewStatus)?.label || wholeOrderNewStatus;
    const requiresAssignment = STATUS_REQUIRES_ASSIGNMENT.includes(wholeOrderNewStatus);
    if (requiresAssignment) {
      try {
        const res = await getAssignmentView(selectedOrder.orderId);
        const data = res?.data ?? res;
        const orderFromView = data?.order;
        const assignments = data?.assignments ?? [];
        const orderItems = orderFromView?.items ?? selectedOrder?.items ?? [];
        const allAssigned = orderItems.length > 0 && orderItems.every((item) =>
          isItemAssigned(assignments, item.itemId ?? item._id)
        );
        if (!allAssigned) {
          openAssignmentModal(selectedOrder.orderId, WHOLE_ORDER_SENTINEL, wholeOrderNewStatus);
          return;
        }
      } catch (err) {
        console.error("Assignment view failed:", err);
        setOrderError(err?.response?.data?.message || "Could not check assignment.");
        return;
      }
    }
    if (!window.confirm(`Set all items in this order to "${label}"? (Terminal items like CANCELLED will be skipped.)`)) return;
    setUpdatingWholeOrder(true);
    setOrderError(null);
    try {
      await updateWholeOrderStatus(selectedOrder.orderId, { status: wholeOrderNewStatus });
      setWholeOrderNewStatus("");
      await fetchSingleOrder(selectedOrder.orderId);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update whole order status.";
      setOrderError(msg);
    } finally {
      setUpdatingWholeOrder(false);
    }
  };

  const toggleItemSelection = (itemId) => {
    const idStr = String(itemId);
    setSelectedItemIds((prev) =>
      prev.includes(idStr) ? prev.filter((id) => id !== idStr) : [...prev, idStr]
    );
  };

  const selectAllOnPage = () => {
    const pageIds = (selectedOrder?.items ?? []).map((it) => String(it.itemId || it._id));
    setSelectedItemIds((prev) => {
      const combined = [...new Set([...prev, ...pageIds])];
      return combined.length === prev.length && pageIds.every((id) => prev.includes(id))
        ? prev.filter((id) => !pageIds.includes(id))
        : combined;
    });
  };

  const handleUpdateSelectedItemsStatus = async () => {
    if (!selectedOrder?.orderId || selectedItemIds.length === 0 || !bulkStatus) return;
    const label = statusOptions.find((o) => o.value === bulkStatus)?.label || bulkStatus;
    const requiresAssignment = STATUS_REQUIRES_ASSIGNMENT.includes(bulkStatus);
    if (requiresAssignment) {
      try {
        const res = await getAssignmentView(selectedOrder.orderId);
        const data = res?.data ?? res;
        const assignments = data?.assignments ?? [];
        const allAssigned = selectedItemIds.every((id) => isItemAssigned(assignments, id));
        if (!allAssigned) {
          openAssignmentModal(selectedOrder.orderId, selectedItemIds, bulkStatus);
          return;
        }
      } catch (err) {
        console.error("Assignment view failed:", err);
        setOrderError(err?.response?.data?.message || "Could not check assignment.");
        return;
      }
    }
    if (!window.confirm(`Set ${selectedItemIds.length} selected item(s) to "${label}"?`)) return;
    setUpdatingBulk(true);
    setOrderError(null);
    try {
      for (const itemId of selectedItemIds) {
        await updateOrderItemStatus(selectedOrder.orderId, itemId, { status: bulkStatus });
      }
      setSelectedItemIds([]);
      setBulkStatus("");
      await fetchSingleOrder(selectedOrder.orderId);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to update selected items.";
      setOrderError(msg);
    } finally {
      setUpdatingBulk(false);
    }
  };

  const handleUpdateItemStatus = async (orderId, itemId, newStatus) => {
    if (!orderId || !itemId || !newStatus) return;
    const stringItemId = String(itemId);
    const requiresAssignment = STATUS_REQUIRES_ASSIGNMENT.includes(newStatus);
    if (requiresAssignment) {
      try {
        const res = await getAssignmentView(orderId);
        const data = res?.data ?? res;
        const assignments = data?.assignments ?? [];
        if (!isItemAssigned(assignments, itemId)) {
          const label = statusOptions.find((o) => o.value === newStatus)?.label || newStatus;
          if (window.confirm(`This item is not assigned to a driver. Assign a driver first, then mark as "${label}". Open assignment?`)) {
            openAssignmentModal(orderId, itemId, newStatus);
          }
          return;
        }
      } catch (err) {
        console.error("Assignment view failed:", err);
        const msg = typeof err === "string" ? err : err?.response?.data?.message || "Could not check assignment.";
        alert(msg);
        return;
      }
    } else {
      const label = statusOptions.find((o) => o.value === newStatus)?.label || newStatus;
      if (!window.confirm(`Update to "${label}"?`)) return;
    }
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
      const msg = typeof err === "string" ? err : err?.response?.data?.message || "Failed to update item status.";
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
      .replace(/_/g, " ")
      .trim();
    const statusStyles = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", Icon: Clock },
      CREATED: { bg: "bg-yellow-100", text: "text-yellow-800", Icon: Clock },
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
      "EXCHANGE PICKED": { bg: "bg-amber-100", text: "text-amber-800", Icon: Truck },
      "EXCHANGE RECEIVED": { bg: "bg-teal-100", text: "text-teal-800", Icon: Package },
      "EXCHANGE PROCESSING": { bg: "bg-blue-100", text: "text-blue-800", Icon: RefreshCw },
      "EXCHANGE SHIPPED": { bg: "bg-purple-100", text: "text-purple-800", Icon: Truck },
      "EXCHANGE DELIVERED": { bg: "bg-green-100", text: "text-green-800", Icon: CheckCircle },
      "EXCHANGE COMPLETED": { bg: "bg-green-100", text: "text-green-800", Icon: CheckCircle },
    };
    const { bg = "bg-gray-100", text = "text-gray-800", Icon = Clock } =
      statusStyles[s] || statusStyles.PENDING;
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
    { value: "CREATED", label: "Created" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "EXCHANGE_REQUESTED", label: "Exchange requested" },
    { value: "EXCHANGE_APPROVED", label: "Exchange approved" },
    { value: "EXCHANGE_REJECTED", label: "Exchange rejected" },
    { value: "EXCHANGE_PICKUP_SCHEDULED", label: "Exchange pickup scheduled" },
    { value: "EXCHANGE_PICKED", label: "Exchange picked" },
    { value: "EXCHANGE_RECEIVED", label: "Exchange received" },
    { value: "EXCHANGE_PROCESSING", label: "Exchange processing" },
    { value: "EXCHANGE_SHIPPED", label: "Exchange shipped" },
    { value: "EXCHANGE_DELIVERED", label: "Exchange delivered" },
    { value: "EXCHANGE_COMPLETED", label: "Exchange completed" },
  ];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 ">
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
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="border-b bg-gray-50 px-6 py-5">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setOrderError(null);
                  setSelectedItemIds([]);
                  setBulkStatus("");
                }}
                className="mb-3 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
              >
                ← Back to orders list
              </button>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder?.orderId || "—"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <Clock size={16} />
                    {new Date(selectedOrder?.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {getStatusBadge(selectedOrder?.status)}

                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-sm text-gray-700 whitespace-nowrap">
                      Update all items:
                    </label>
                    <select
                      value={wholeOrderNewStatus}
                      onChange={(e) => setWholeOrderNewStatus(e.target.value)}
                      disabled={updatingWholeOrder}
                      className="min-w-[160px] rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-60"
                    >
                      <option value="">Select status…</option>
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateWholeOrderStatus}
                      disabled={updatingWholeOrder || !wholeOrderNewStatus}
                      className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2"
                    >
                      {updatingWholeOrder ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Applying…
                        </>
                      ) : (
                        "Apply to all"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {orderError && (
              <div className="mx-6 mt-5 rounded-lg bg-red-50 p-4 text-red-700 flex items-center gap-3">
                <AlertCircle size={20} />
                {orderError}
              </div>
            )}

            <div className="p-6 space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={18} className="text-indigo-600" />
                    <h4 className="text-sm font-semibold text-gray-700">Customer</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedOrder?.userId?.name || "—"}</p>
                    <p><strong>Phone:</strong> {selectedOrder?.userId?.countryCode || ""}{selectedOrder?.userId?.phoneNumber || "—"}</p>
                    <p><strong>Email:</strong> {selectedOrder?.userId?.email || "—"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={18} className="text-indigo-600" />
                    <h4 className="text-sm font-semibold text-gray-700">Payment</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Mode:</strong>{" "}
                      <span className={selectedOrder?.payment?.mode === "COD" ? "text-orange-700 font-medium" : ""}>
                        {selectedOrder?.payment?.mode || "—"}
                      </span>
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={
                        selectedOrder?.payment?.status === "SUCCESS" ? "text-green-700 font-medium" :
                        selectedOrder?.payment?.status === "PENDING" ? "text-amber-700 font-medium" :
                        "text-red-700 font-medium"
                      }>
                        {selectedOrder?.payment?.status || "—"}
                      </span>
                    </p>
                    <p><strong>Amount:</strong> ₹{(selectedOrder?.payment?.amount || 0).toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} className="text-indigo-600" />
                    <h4 className="text-sm font-semibold text-gray-700">Delivery Address</h4>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{selectedOrder?.address?.name || "—"}</p>
                    <p>{selectedOrder?.address?.fullAddress || "—"}</p>
                    <p>Pincode: {selectedOrder?.address?.pincode || "—"}</p>
                    <p>Phone: {selectedOrder?.address?.phone || "—"}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={18} className="text-indigo-600" />
                    <h4 className="text-sm font-semibold text-gray-700">Pricing</h4>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>Subtotal: ₹{(selectedOrder?.pricing?.subTotal || 0).toLocaleString("en-IN")}</p>
                    <p>Delivery: ₹{(selectedOrder?.pricing?.delivery?.totalCharge || 0).toLocaleString("en-IN")}</p>
                    <p>GST: ₹{(selectedOrder?.pricing?.gst?.totalGst || 0).toLocaleString("en-IN")}</p>
                    <p className="font-bold text-base pt-2 border-t mt-2">
                      Final Payable: ₹{(selectedOrder?.pricing?.finalPayable || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder?.shipments?.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck size={18} className="text-indigo-600" />
                    <h4 className="text-sm font-semibold text-gray-700">Shipments / Warehouses</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {selectedOrder.shipments.map((ship, idx) => (
                      <div key={idx} className="p-4 bg-white rounded border shadow-sm">
                        <p className="font-medium mb-1">{ship.shipmentGroupId}</p>
                        <p>Warehouse: {ship.warehouseId?.name || "—"} ({ship.warehouseId?.code || "—"})</p>
                        <p>Status: <span className="font-medium">{ship.status}</span></p>
                        <p>Type: {ship.deliveryType}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingBag size={20} />
                    Order Items ({selectedOrder?.totalQuantity || selectedOrder?.items?.length || 0})
                  </h3>

                  {selectedOrder?.items?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {selectedItemIds.length > 0 ? `${selectedItemIds.length} selected` : "Bulk actions"}
                      </span>
                      <select
                        value={bulkStatus}
                        onChange={(e) => setBulkStatus(e.target.value)}
                        disabled={updatingBulk || selectedItemIds.length === 0}
                        className="min-w-[180px] rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-60"
                      >
                        <option value="">Update selected to…</option>
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleUpdateSelectedItemsStatus}
                        disabled={updatingBulk || selectedItemIds.length === 0 || !bulkStatus}
                        className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2"
                      >
                        {updatingBulk ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            Updating…
                          </>
                        ) : (
                          "Apply bulk"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {orderLoading ? (
                  <div className="py-12 text-center text-gray-500">Loading items…</div>
                ) : !selectedOrder?.items?.length ? (
                  <div className="py-12 text-center text-gray-500">No items found</div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3.5 text-left">
                            <input
                              type="checkbox"
                              checked={
                                selectedOrder.items.length > 0 &&
                                selectedOrder.items.every((it) =>
                                  selectedItemIds.includes(String(it.itemId || it._id))
                                )
                              }
                              onChange={selectAllOnPage}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </th>
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
                          const isSelected = selectedItemIds.includes(itemId);
                          return (
                            <tr key={itemId} className={`hover:bg-gray-50/60 ${isSelected ? "bg-indigo-50/50" : ""}`}>
                              <td className="px-4 py-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleItemSelection(itemId)}
                                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                              </td>
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
                                    value={item.status || "CREATED"}
                                    onChange={(e) => {
                                      const newVal = e.target.value;
                                      handleUpdateItemStatus(selectedOrder.orderId, itemId, newVal);
                                    }}
                                    disabled={isUpdating}
                                    className={`rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                      isUpdating ? "opacity-60 cursor-wait" : ""
                                    }`}
                                  >
                                    {statusOptions.map((opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
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
          </div>
        )}

        {/* Assignment Modal */}
        {assignmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assign delivery driver</h3>
              <p className="text-sm text-gray-600 mb-4">
                {assignmentMode === "whole"
                  ? `Assign a driver to this order before marking as ${statusOptions.find((o) => o.value === pendingNewStatus)?.label || pendingNewStatus}.`
                  : assignmentItemIds.length === 1
                    ? `Assign a driver to this item before marking as ${statusOptions.find((o) => o.value === pendingNewStatus)?.label || pendingNewStatus}.`
                    : `Assign a driver to these ${assignmentItemIds.length} items before marking as ${statusOptions.find((o) => o.value === pendingNewStatus)?.label || pendingNewStatus}.`}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery agent</label>
                <select
                  value={selectedDeliveryAgentId}
                  onChange={(e) => setSelectedDeliveryAgentId(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select driver</option>
                  {deliveryAgentsList
                    .filter((a) => a.isActive !== false)
                    .map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name || "Driver"} {agent.phoneNumber ? ` – ${agent.phoneNumber}` : ""}
                      </option>
                    ))}
                </select>
              </div>
              {assignError && (
                <p className="text-sm text-red-600 mb-3">{assignError}</p>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => !assignLoading && setAssignmentModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignmentSubmit}
                  disabled={assignLoading || !selectedDeliveryAgentId}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {assignLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Assigning…
                    </>
                  ) : (
                    "Assign & update status"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;