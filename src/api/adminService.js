// src/api/adminService.js

import apiService from './apiService';

const API_URL = '/admin';

/**
 * Fetches all registered admin chats.
 * @returns {Promise}
 */
const getAdminChats = () => apiService.get(`${API_URL}/chats`);

/**
 * Creates a new admin chat.
 * The backend defaults receiveNotifications to true.
 * @param {number} chatId The chat ID of the new admin.
 * @returns {Promise}
 */
const createAdminChat = (chatId) => {
    // Backend uses @RequestParam, so we send it in the 'params' config.
    // The second argument to post (the body) is null.
    return apiService.post(`${API_URL}/chats`, null, {
        params: { chatId }
    });
};

/**
 * Updates the notification status for a given chat ID.
 * @param {number} chatId The admin's chat ID.
 * @param {boolean} enable The new notification status (true for on, false for off).
 * @returns {Promise}
 */
const updateNotificationStatus = (chatId, enable) => {
    return apiService.put(`${API_URL}/chats/${chatId}`, null, {
        params: { enable }
    });
};

/**
 * Deletes an admin chat by its ID.
 * @param {number} chatId The admin's chat ID to delete.
 * @returns {Promise}
 */
const deleteAdminChat = (chatId) => apiService.delete(`${API_URL}/chats/${chatId}`);

export const adminService = {
    getAdminChats,
    createAdminChat, // <-- Add the new function here
    updateNotificationStatus,
    deleteAdminChat,
};