// src/api/dashboardService.js

import apiService from './apiService';

const API_URL = '/dashboard';

/**
 * Fetches the main, comprehensive dashboard statistics in a single API call.
 * This function is designed to work with your backend's `/api/dashboard/stats` endpoint.
 *
 * @param {object} filters - An optional object containing filter parameters.
 *   Example: { startDate: '2023-10-01T00:00:00', endDate: '2023-10-31T23:59:59' }
 *
 * @returns {Promise} A promise that resolves to the full DashboardStats object from the backend.
 */
const getDashboardStats = (filters = {}) => {
    // URLSearchParams is a modern and safe way to build query strings.
    // It automatically handles cases where filter values are null or undefined,
    // so they won't be included in the final URL.
    const params = new URLSearchParams(filters);

    // Makes a GET request to, for example: /api/dashboard/stats?startDate=...&endDate=...
    return apiService.get(`${API_URL}/stats`, { params });
};


// We export an object containing our service function(s) for easy importing elsewhere.
export const dashboardService = {
    getDashboardStats,
};