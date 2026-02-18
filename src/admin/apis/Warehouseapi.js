import { apiConnector } from "../services/Apiconnector";

export const warehouseEndpoints = {
  // 🔹 Warehouse
  CREATE_WAREHOUSE: "/warehouse/create",
  GET_SINGLE_WAREHOUSE: "/warehouse/getSingle",
  UPDATE_WAREHOUSE: "/warehouse/update",
  TOGGLE_WAREHOUSE_STATUS: "/warehouse/toggle-active",
  DELETE_WAREHOUSE: "/warehouse/delete",
  GET_WAREHOUSE_LIST: "/warehouse/getAll",

  // 🔹 Warehouse Pincodes
  GET_WAREHOUSE_PINCODES: "/warehouse",
  ADD_WAREHOUSE_PINCODES: "/warehouse",
  DELETE_WAREHOUSE_PINCODE: "/warehouse",

  // 🔹 Warehouse Stock
  GET_WAREHOUSE_STOCK: "/warehouse",
  UPDATE_WAREHOUSE_STOCK: "/warehouse",
};


// ================================
// 🏭 Warehouse APIs
// ================================

// ✅ Create Warehouse
export const createWarehouse = (data) => {
  return apiConnector(
    "POST",
    warehouseEndpoints.CREATE_WAREHOUSE,
    data
  );
};

// ✅ Get Single Warehouse
export const getWarehouseById = (id) => {
  return apiConnector(
    "GET",
    `${warehouseEndpoints.GET_SINGLE_WAREHOUSE}/${id}`
  );
};

// ✅ Update Warehouse
export const updateWarehouse = (id, data) => {
  return apiConnector(
    "PUT",
    `${warehouseEndpoints.UPDATE_WAREHOUSE}/${id}`,
    data
  );
};

// ✅ Toggle Warehouse Status
export const toggleWarehouseStatus = (id) => {
  return apiConnector(
    "PUT",
    `${warehouseEndpoints.TOGGLE_WAREHOUSE_STATUS}/${id}`
  );
};

// ✅ Delete Warehouse
export const deleteWarehouse = (id) => {
  return apiConnector(
    "DELETE",
    `${warehouseEndpoints.DELETE_WAREHOUSE}/${id}`
  );
};

// ✅ Get Warehouse List
export const getWarehouses = (page = 1, limit = 10, search = "") => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    search,
  });

  const endpoint = `${warehouseEndpoints.GET_WAREHOUSE_LIST}?${queryParams.toString()}`;
  console.log("🔍 Warehouse API endpoint:", endpoint);
  
  return apiConnector(
    "GET",
    endpoint
  );
};



// ================================
// 📍 Warehouse Pincode APIs
// ================================

// ✅ Get All Pincodes of Warehouse
export const getWarehousePincodes = (warehouseId) => {
  return apiConnector(
    "GET",
    `${warehouseEndpoints.GET_WAREHOUSE_PINCODES}/${warehouseId}/pincodes`
  );
};

// ✅ Add Pincodes to Warehouse
// (pass array or single pincodeId as per backend)
export const addWarehousePincodes = (warehouseId, data) => {
  return apiConnector(
    "POST",
    `${warehouseEndpoints.ADD_WAREHOUSE_PINCODES}/${warehouseId}/pincodes`,
    data
  );
};

// ✅ Delete Specific Pincode from Warehouse
export const deleteWarehousePincode = (warehouseId, pincodeId) => {
  return apiConnector(
    "DELETE",
    `${warehouseEndpoints.DELETE_WAREHOUSE_PINCODE}/${warehouseId}/pincodes/${pincodeId}`
  );
};



// ================================
// 📦 Warehouse Stock APIs
// ================================

// ✅ Get Warehouse Stock (with pagination)
export const getWarehouseStock = (
  warehouseId,
  page = 1,
  limit = 50
) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
  });

  return apiConnector(
    "GET",
    `${warehouseEndpoints.GET_WAREHOUSE_STOCK}/${warehouseId}/stock?${queryParams.toString()}`
  );
};

// ✅ Add / Update Stock
// body: { sku: "SKU-0-S", quantity: 3 }
export const updateWarehouseStock = (warehouseId, data) => {
  return apiConnector(
    "POST",
    `${warehouseEndpoints.UPDATE_WAREHOUSE_STOCK}/${warehouseId}/stock`,
    data
  );
};
