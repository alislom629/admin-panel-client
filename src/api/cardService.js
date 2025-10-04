// src/api/cardService.js
import apiService from "./apiService";

const API_URL = "/admin/cards";

// UPDATED: Fetches ALL cards from all configs
const getCards = () => apiService.get(API_URL);

// These functions remain the same as they are still needed for creating/updating
const getCard = (id) => apiService.get(`${API_URL}/${id}`);
const createCard = (osonConfigId, cardData) =>
  apiService.post(`${API_URL}/oson/${osonConfigId}`, cardData);
const updateCard = (id, cardData) =>
  apiService.put(`${API_URL}/${id}`, cardData);
const deleteCard = (id) => apiService.delete(`${API_URL}/${id}`);

export const cardService = {
  getCards, // Use this for the main card list page
  getCard,
  createCard,
  updateCard,
  deleteCard,
};
