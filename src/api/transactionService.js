import apiService from './apiService';

const API_URL = '/transactions';

/**
 * Fetches transactions based on a filter object.
 * @param {object} filters - The filter parameters.
 * @returns {Promise} Axios promise
 */
const getTransactions = (filters) => {
    // Clean up filters: remove null or empty string values
    const activeFilters = Object.entries(filters)
        .filter(([key, value]) => value !== null && value !== '')
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});

    return apiService.get(API_URL, { params: activeFilters });
};

const deleteTransaction = (id) => {
    return apiService.delete(`${API_URL}/${id}`);
};

const deleteBulkTransactions = (ids) => {
    // The body should be an array of IDs, e.g., [1, 2, 3]
    return apiService.delete(`${API_URL}/bulk`, { data: ids });
};


export const transactionService = {
    getTransactions,
    deleteTransaction,
    deleteBulkTransactions,
};