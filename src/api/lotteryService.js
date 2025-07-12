// src/api/lotteryService.js

import apiService from './apiService'; // This line will now work!

const API_URL = '/lottery';

// --- Prize Management ---
const getPrizes = () => apiService.get(`${API_URL}/prizes`);
const addPrize = (prizeData) => apiService.post(`${API_URL}/prizes`, prizeData);
const deletePrize = (id) => apiService.delete(`${API_URL}/prizes/${id}`);

// --- User Data ---
const getUserBalance = (chatId) => apiService.get(`${API_URL}/balance/${chatId}`);

// This is a "named" export, which is correct for this file.
export const lotteryService = {
    getPrizes,
    addPrize,
    deletePrize,
    getUserBalance,
};