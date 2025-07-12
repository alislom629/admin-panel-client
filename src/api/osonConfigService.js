// src/api/osonConfigService.js

import apiService from './apiService';

const API_URL = '/oson/config';

/**
 * Fetches the current Oson configuration.
 * @returns {Promise}
 */
const getOsonConfig = () => apiService.get(API_URL);

/**
 * Creates the Oson configuration for the first time.
 * @param {object} configData - The configuration object.
 * @returns {Promise}
 */
const saveOsonConfig = (configData) => apiService.post(API_URL, configData);

/**
 * Updates the existing Oson configuration.
 * @param {object} configData - The configuration object.
 * @returns {Promise}
 */
const updateOsonConfig = (configData) => apiService.put(API_URL, configData);

/**
 * Deletes the Oson configuration.
 * @returns {Promise}
 */
const deleteOsonConfig = () => apiService.delete(API_URL);

export const osonConfigService = {
    getOsonConfig,
    saveOsonConfig,
    updateOsonConfig,
    deleteOsonConfig,
};