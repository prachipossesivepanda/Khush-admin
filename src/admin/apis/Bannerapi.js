// src/apis/Bannerapi.js  (or your current file)

import { apiConnector } from "../services/Apiconnector";

export const featuredImageEndpoints = {
  CREATE_FEATURED_IMAGE: "/featuredImages/create",
  GET_FEATURED_IMAGES: "/featuredImages/get-all",          // ← changed here: get-all (hyphen + lowercase)
  UPDATE_FEATURED_IMAGE: "/featuredImages/update",        // keep for now
  DELETE_FEATURED_IMAGE: "/featuredImages/delete",        // keep for now
};

export const createFeaturedImage = (data) => {
  return apiConnector(
    "POST",
    featuredImageEndpoints.CREATE_FEATURED_IMAGE,
    data // FormData – should already include heading, subHeading, page, file
  );
};

export const getFeaturedImages = (page = "") => {
  return apiConnector(
    "GET",
    featuredImageEndpoints.GET_FEATURED_IMAGES,
    null,
    {},                           // headers if needed
    page ? { page } : {}          // query params – this is correct
  );
};

// ✅ Update Featured Image
// Note: FormData Content-Type is handled automatically by the browser (with boundary)
// imageId is sent as query parameter, other data in FormData body
export const updateFeaturedImage = (imageId, formData) => {
  return apiConnector(
    "PUT",
    featuredImageEndpoints.UPDATE_FEATURED_IMAGE,
    formData,
    {},
    { imageId } // Send imageId as query parameter
  );
};



// ✅ Delete Featured Image (using path parameter)
export const deleteFeaturedImage = (id) => {
  return apiConnector(
    "DELETE",
    `${featuredImageEndpoints.DELETE_FEATURED_IMAGE}/${id}`
  );
};
