import { apiConnector } from "../services/Apiconnector";

/**
 * ================================
 * AUTH API ENDPOINTS
 * ================================
 */
export const authEndpoints = {
  REGISTER: "/auth/register",        // send OTP
  VERIFY_OTP: "/admin/verify-otp",    // verify OTP
  LOGIN: "/admin/login",              // (if backend supports)
  LOGOUT: "/admin/logout",            // logout endpoint
  GET_PROFILE: "/auth/profile",      // (optional)
};

/**
 * ================================
 * SEND OTP / REGISTER USER
 * ================================
 * @param {Object} data
 * {
 *   name: string,
 *   countryCode: string,
 *   phoneNumber: string,
 *   role: string
 * }
 */
export const registerUser = (data) => {
  return apiConnector(
    "POST",
    authEndpoints.REGISTER,
    data
  );
};

/**
 * ================================
 * VERIFY OTP
 * ================================
 * @param {Object} data
 * {
 *   userId: string,
 *   otp: string
 * }
 */
export const verifyOtp = (data) => {
  return apiConnector(
    "POST",
    authEndpoints.VERIFY_OTP,
    data
  );
};

/**
 * ================================
 * LOGIN (OPTIONAL)
 * ================================
 */
export const loginUser = (data) => {
  return apiConnector(
    "POST",
    authEndpoints.LOGIN,
    data
  );
};

/**
 * ================================
 * LOGOUT
 * ================================
 */
export const logoutUser = () => {
  console.log("🚪 Logging out user...");
  return apiConnector(
    "POST",
    authEndpoints.LOGOUT
  );
};

/**
 * ================================
 * GET USER PROFILE (OPTIONAL)
 * Token automatically added via interceptor
 * ================================
 */
export const getUserProfile = () => {
  return apiConnector(
    "GET",
    authEndpoints.GET_PROFILE
  );
};
