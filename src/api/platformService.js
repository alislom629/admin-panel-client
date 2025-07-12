import apiService from './apiService';

const API_URL = '/platforms';

const getPlatforms = () => apiService.get(API_URL);
const getPlatform = (id) => apiService.get(`${API_URL}/${id}`);
const createPlatform = (platformData) => apiService.post(API_URL, platformData);
const updatePlatform = (id, platformData) => apiService.put(`${API_URL}/${id}`, platformData);
const deletePlatform = (id) => apiService.delete(`${API_URL}/${id}`);

export const platformService = {
    getPlatforms,
    getPlatform,
    createPlatform,
    updatePlatform,
    deletePlatform,
};