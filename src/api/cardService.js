// src/api/cardService.js

import apiService from './apiService';

const API_URL = '/admin/cards';

const getCards = () => apiService.get(API_URL);
const getCard = (id) => apiService.get(`${API_URL}/${id}`);
const createCard = (cardData) => apiService.post(API_URL, cardData);
const updateCard = (id, cardData) => apiService.put(`${API_URL}/${id}`, cardData);
const deleteCard = (id) => apiService.delete(`${API_URL}/${id}`);
const setMainCard = (id) => apiService.put(`${API_URL}/${id}/set-main`);

/**
 * Triggers the backend to fetch cards & balance from Oson and save them.
 * @returns {Promise} A promise that resolves with the sync result, including wallet balance.
 */
const syncCardsFromOson = () => apiService.get('/admin/cards-and-wallet');


export const cardService = {
    getCards,
    getCard,
    createCard,
    updateCard,
    deleteCard,
    setMainCard,
    syncCardsFromOson, // <-- Export the new function
};