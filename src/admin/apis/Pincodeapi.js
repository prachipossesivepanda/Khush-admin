import { apiConnector } from "../services/Apiconnector";

export const pincodeEndpoints = {
  CREATE_PINCODE: "/servicablePincode/create",
  GET_PINCODES: "/servicablePincode/getAll",
  UPDATE_PINCODE: "/servicablePincode/update",
  DELETE_PINCODE: "/servicablePincode/delete",
};

// ✅ Create Pincode
export const createPincode = (data) => {
  return apiConnector(
    "POST",
    pincodeEndpoints.CREATE_PINCODE,
    data
  );
};

// ✅ Get All Pincodes
export const getPincodes = () => {
  return apiConnector(
    "GET",
    pincodeEndpoints.GET_PINCODES
  );
};

// ✅ Update Pincode (send pincode in URL like backend expects)
export const updatePincode = (pincode, data) => {
  return apiConnector(
    "PUT",
    `${pincodeEndpoints.UPDATE_PINCODE}/${pincode}`,
    data
  );
};

// ✅ Delete Pincode
export const deletePincode = (pincode) => {
  return apiConnector(
    "DELETE",
    `${pincodeEndpoints.DELETE_PINCODE}/${pincode}`
  );
};
