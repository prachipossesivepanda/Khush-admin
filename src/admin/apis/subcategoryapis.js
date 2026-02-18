// subcategoryapi.js
import { apiConnector } from "../services/Apiconnector";

export const getSubcategoriesByCategory = (
  categoryId,
  page = 1,
  limit = 10
) => {
  return apiConnector(
    "GET",
    `/subcategories/getAll/${categoryId}?&page=${page}&limit=${limit}`
  );
};

export const createSubcategory = (categoryId, formData) => {
    return apiConnector(
      "POST",
      `/subcategories/create/${categoryId}`,
      formData // body
    );
  };
  export const updateSubcategory = (subcategoryId, formData) => {
    return apiConnector(
      "PATCH",
      `/subcategories/update/${subcategoryId}`,
      formData // body
    );
  };
  export const toggleSubcategoryActiveStatus = (subcategoryId) => {
    return apiConnector(
      "PATCH",
      `/subcategories/activeStatus/${subcategoryId}`
    );
  };
  export const toggleSubcategoryNavbarStatus = (subcategoryId) => {
    return apiConnector(
      "PATCH",
      `/subcategories/navbarStatus/${subcategoryId}`
    );
  };