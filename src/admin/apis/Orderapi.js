import { apiConnector } from "../services/Apiconnector";

// ✅ Orders Endpoints
const orderEndpoints = {
  // Get All Orders (with pagination + search + status)
  GET_ORDERS: (page = 1, limit = 10, search = "", status = "") => {
    let url = `/admin/orders?page=${page}&limit=${limit}`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (status) {
      url += `&orderStatus=${status}`;
    }

    return url;
  },

  // Get Single Order (with item pagination)
  GET_SINGLE_ORDER: (orderId, itemPage = 1, itemLimit = 10) =>
    `/admin/orders/${orderId}?itemPage=${itemPage}&itemLimit=${itemLimit}`,

  // Update Single Item Status inside Order
  UPDATE_ITEM_STATUS: (orderId, itemId) =>
    `/admin/orders/${orderId}/items/${itemId}/status`,
};

// ✅ Get All Orders
export const getOrders = (page, limit, search, status) => {
  return apiConnector(
    "GET",
    orderEndpoints.GET_ORDERS(page, limit, search, status)
  );
};

// ✅ Get Single Order
export const getSingleOrder = (orderId, itemPage, itemLimit) => {
  return apiConnector(
    "GET",
    orderEndpoints.GET_SINGLE_ORDER(orderId, itemPage, itemLimit)
  );
};

// ✅ Update Item Status
export const updateOrderItemStatus = (orderId, itemId, data) => {
  return apiConnector(
    "PATCH", // change to PUT if backend uses PUT
    orderEndpoints.UPDATE_ITEM_STATUS(orderId, itemId),
    data
  );
};