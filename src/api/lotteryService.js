// src/api/lotteryService.js

import apiService from './apiService';

const API_URL = '/lottery';

// --- Prize Management (No Changes) ---
const getPrizes = () => apiService.get(`${API_URL}/prizes`);
const addPrize = (prizeData) => apiService.post(`${API_URL}/prizes`, prizeData);
const deletePrize = (id) => apiService.delete(`${API_URL}/prizes/${id}`);

// --- User Data ---
const getUserBalance = (chatId) => apiService.get(`${API_URL}/balance/${chatId}`);

// 👇 --- ADD THE NEW FUNCTIONS HERE --- 👇

/**
 * Awards a specified number of tickets to a user.
 * @param {number} chatId The user's chat ID.
 * @param {number} amount The number of tickets to award.
 * @returns {Promise} A promise that resolves to the user's updated balance.
 */
const addTickets = (chatId, amount) => {
    // The amount is sent as a request parameter, not in the body
    return apiService.post(`${API_URL}/tickets/${chatId}`, null, {
        params: { amount }
    });
};

/**
 * Resets a user's ticket count to 0.
 * @param {number} chatId The user's chat ID.
 * @returns {Promise}
 */
const resetTickets = (chatId) => apiService.delete(`${API_URL}/tickets/${chatId}`);

/**
 * Resets a user's balance to 0.
 * @param {number} chatId The user's chat ID.
 * @returns {Promise}
 */
const resetBalance = (chatId) => apiService.delete(`${API_URL}/balance/${chatId}`);


export const lotteryService = {
    getPrizes,
    addPrize,
    deletePrize,
    getUserBalance,
    // Export the new functions
    addTickets,
    resetTickets,
    resetBalance,
};