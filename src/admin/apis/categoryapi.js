import { apiConnector } from "../services/Apiconnector";

/**
 * ================================
 * CATEGORY API ENDPOINTS
 * ================================
 */
export const categoryEndpoints = {
  CREATE_CATEGORY: "/categories/create",
  GET_ALL_CATEGORIES: "/categories/getAll",
  UPDATE_CATEGORY: "/categories/update",   // + /:id
  TOGGLE_ACTIVE_STATUS: "/categories/activeStatus",
  TOGGLE_NAVBAR_STATUS: "/categories/navbarStatus",   // + /:id
};

/**
 * ================================
 * CREATE CATEGORY
 * Can be FormData or JSON
 * ================================
 */
export const createCategory = (data) => {
  return apiConnector("POST", categoryEndpoints.CREATE_CATEGORY, data);
};

/**
 * ================================
 * GET ALL CATEGORIES (PAGINATED)
 * ================================
 */
export const getAllCategories = (page = 1, limit = 10) => {
  return apiConnector(
    "GET",
    categoryEndpoints.GET_ALL_CATEGORIES,
    null,
    {},
    { page, limit } // query params
  );
};

/**
 * ================================
 * UPDATE CATEGORY
 * Can be FormData or JSON
 * ================================
 */
export const updateCategory = (categoryId, data) => {
  return apiConnector(
    "PATCH",
    `${categoryEndpoints.UPDATE_CATEGORY}/${categoryId}`,
    data
  );
};

/**
 * ================================
 * TOGGLE CATEGORY ACTIVE STATUS
 * ================================
 */
export const toggleCategoryActiveStatus = (categoryId) => {
  return apiConnector(
    "PATCH",
    `${categoryEndpoints.TOGGLE_ACTIVE_STATUS}/${categoryId}`
  );
};

/**
 * ================================
 * TOGGLE CATEGORY NAVBAR STATUS
 * ================================
 */
export const toggleCategoryNavbarStatus = (categoryId) => {
  return apiConnector(
    "PATCH",
    `${categoryEndpoints.TOGGLE_NAVBAR_STATUS}/${categoryId}`
  );
};
