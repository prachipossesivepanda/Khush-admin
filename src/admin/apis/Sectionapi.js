import { apiConnector } from "../services/Apiconnector";

export const sectionEndpoints = {
  CREATE_SECTION: "/sections/create",
  GET_SECTIONS: "/sections/get",
  UPDATE_SECTION: "/sections/update",
  DELETE_SECTION: "/sections/delete",
};

// ✅ Create Section
export const createSection = (data) => {
  return apiConnector("POST", sectionEndpoints.CREATE_SECTION, data);
};

// ✅ Get Sections (MANUAL / CATEGORY)
export const getSections = ({
  type = "MANUAL",
  page = 1,
  limit = 5,
} = {}) => {
  const query = `?type=${type}&page=${page}&limit=${limit}`;

  return apiConnector(
    "GET",
    sectionEndpoints.GET_SECTIONS + query
  );
};

// ✅ Update Section
export const updateSection = (id, data) => {
  return apiConnector(
    "PATCH",
    sectionEndpoints.UPDATE_SECTION,
    data,
    {},
    { sectionId: id }
  );
};

// ✅ Delete Section
export const deleteSection = (id) => {
  return apiConnector(
    "DELETE",
    sectionEndpoints.DELETE_SECTION,
    null,
    {},
    { sectionId: id }
  );
};
