// src/api/cardService.js (This should be the name of your file)
// If you don't have this file, create it based on the initial prompt.

import apiService from './apiService';

const API_URL = '/admin/cards';

const getCards = () => apiService.get(API_URL);
const getCard = (id) => apiService.get(`${API_URL}/${id}`);
const createCard = (cardData) => apiService.post(API_URL, cardData);
const updateCard = (id, cardData) => apiService.put(`${API_URL}/${id}`, cardData);
const deleteCard = (id) => apiService.delete(`${API_URL}/${id}`);

// 👇 ADD THIS NEW FUNCTION
/**
 * Sets a specific card as the main card.
 * @param {number} id - The ID of the card to set as main.
 * @returns {Promise}
 */
const setMainCard = (id) => apiService.put(`${API_URL}/${id}/set-main`);


export const cardService = {
    getCards,
    getCard,
    createCard,
    updateCard,
    deleteCard,
    setMainCard, // <-- Export the new function
};