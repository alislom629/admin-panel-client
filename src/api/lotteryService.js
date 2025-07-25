// src/api/lotteryService.js

import apiService from './apiService';

const API_URL = '/lottery';

// --- Prize Management & User Data ---
const getPrizes = () => apiService.get(`${API_URL}/prizes`);
const addPrize = (prizeData) => apiService.post(`${API_URL}/prizes`, prizeData);
const deletePrize = (id) => apiService.delete(`${API_URL}/prizes/${id}`);
const getUserBalance = (chatId) => apiService.get(`${API_URL}/balance/${chatId}`);
const addTickets = (chatId, amount) => apiService.post(`${API_URL}/tickets/${chatId}`, null, { params: { amount } });
const resetTickets = (chatId) => apiService.delete(`${API_URL}/tickets/${chatId}`);
const resetBalance = (chatId) => apiService.delete(`${API_URL}/balance/${chatId}`);

/**
 * Awards a specified amount of MONEY to a random selection of users.
 * @param {object} awardData - Contains totalUsers, randomUsers, and amount.
 * @returns {Promise}
 */
const awardRandomUsers = ({ totalUsers, randomUsers, amount }) => {
    // Corrected URL: /lottery/award-random-users
    return apiService.post(`${API_URL}/award-random-users`, null, {
        params: {
            totalUsers,
            randomUsers,
            amount
        }
    });
};

export const lotteryService = {
    getPrizes,
    addPrize,
    deletePrize,
    getUserBalance,
    addTickets,
    resetTickets,
    resetBalance,
    awardRandomUsers, // Export the new function
};