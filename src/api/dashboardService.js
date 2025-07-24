// src/api/dashboardService.js
import apiService from './apiService';

const API_URL = '/dashboard';

const getDashboardStats = (params) => {
    return apiService.get(`${API_URL}/stats`, { params });
};

// 👇 ADD THIS NEW FUNCTION 👇
const getTotalApprovedBonusAmount = (params) => {
    return apiService.get(`${API_URL}/requests/total-bonus-amount`, { params });
};

export const dashboardService = {
    getDashboardStats,
    getTotalApprovedBonusAmount, // Export the new function
};