// src/api/osonConfigService.js
import apiService from './apiService';

const API_URL = '/oson/config';

const getAllConfigs = () => apiService.get(API_URL);
const getConfig = (id) => apiService.get(`${API_URL}/${id}`); // <-- ADD THIS
const saveConfig = (configData) => apiService.post(API_URL, configData);
const updateConfig = (id, configData) => apiService.put(`${API_URL}/${id}`, configData);
const deleteConfig = (id) => apiService.delete(`${API_URL}/${id}`);
const setPrimary = (id) => apiService.put(`${API_URL}/${id}/set-primary`);

export const osonConfigService = {
    getAllConfigs,
    getConfig,
    saveConfig,
    updateConfig,
    deleteConfig,
    setPrimary,
};