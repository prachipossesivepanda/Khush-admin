import { apiConnector } from "../services/Apiconnector";

// API endpoints
const FILTER_API = {
  CREATE_FILTER: "/filters/create",
  TOGGLE_STATUS: "/items/toggleactiveStatus",
};

// Create Filter API
export const createFilter = (data) => {
  return apiConnector("POST", FILTER_API.CREATE_FILTER, data);
};

export const getFilters = (params) => {
  return apiConnector("GET", "/filters/all", null, {}, params);
};

export const deleteFilter = (id) => {
  return apiConnector("DELETE", `/filters/${id}`);
};
export const updateFilter = (id, data) => {
    return apiConnector("PUT", `/filters/${id}`, data);
}
export const toggleFilterStatus = (id) => {
  return apiConnector("PATCH", `${FILTER_API.TOGGLE_STATUS}/${id}`);
};