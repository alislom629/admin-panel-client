import apiService from './apiService';

const API_URL = '/broadcast/send';

/**
 * Sends a broadcast message.
 * @param {object} broadcastData - The message data { messageText, buttonText, buttonUrl, scheduledTime }.
 * @returns {Promise} A promise that resolves on successful initiation.
 */
const sendBroadcast = (broadcastData) => apiService.post(API_URL, broadcastData);

export const broadcastService = {
    sendBroadcast,
};