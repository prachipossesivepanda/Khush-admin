import { apiConnector } from "../services/Apiconnector";

// API endpoints
const COUPON_API = {
  CREATE: "/coupons/create",
  UPDATE: "/coupons/update",               // /coupon/update/:id
  GET_ALL: "/coupons/getAll",
  GET_SINGLE: "/coupons/getSingle",        // /coupon/getSingle/:id
  DELETE: "/coupons/delete",               // if exists
   
};

// ✅ Create Coupon
export const createCoupon = (data) => {
  return apiConnector("POST", COUPON_API.CREATE, data);
};

// ✅ Get All Coupons
export const getCoupons = (params) => {
  return apiConnector("GET", COUPON_API.GET_ALL, null, {}, params);
};

// ✅ Get Single Coupon by ID
export const getCouponById = (id) => {
  return apiConnector("GET", `${COUPON_API.GET_SINGLE}/${id}`);
};

// ✅ Update Coupon
export const updateCoupon = (id, data) => {
  return apiConnector("PUT", `${COUPON_API.UPDATE}/${id}`, data);
};



// ✅ Delete Coupon (if API exists)
export const deleteCoupon = (id) => {
  return apiConnector("DELETE", `/coupon/delete/${id}`);
};
