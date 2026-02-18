import { apiConnector } from '../services/Apiconnector';

/**
 * Get items by subcategory with pagination
 */
export const getItemsBySubcategory = async (subcategoryId, page = 1, limit = 10) => {
  try {
    const response = await apiConnector(
      'GET',
      `/items/get/subcategory/${subcategoryId}`,
      null,
      {},
      { page, limit }
    );
    return response;
  } catch (error) {
    console.error('Error fetching subcategory items:', error);
    throw error;
  }
};

/**
 * Create new item
 */
export const createItem = async (formData) => {
  try {
    const response = await apiConnector(
      'POST',
      '/items/create',
      formData,
      {
        'Content-Type': 'multipart/form-data',
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

/**
 * Update existing item
 * @param {string} productId
 * @param {FormData} formData
 */
export const updateItem = async (productId, formData) => {
  try {
    const response = await apiConnector(
      'PATCH',
      `/items/update/${productId}`,
      formData,
      {
        'Content-Type': 'multipart/form-data',
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};
export const getSingleItem = async (itemId) => {
  try {
    const response = await apiConnector(
      'GET',
      `/items/single/${itemId}`
    );
    return response;
  } catch (error) {
    console.error('Error fetching item details:', error);
    throw error;
  }
};