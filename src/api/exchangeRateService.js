import apiService from './apiService';

const API_URL = '/exchange-rates';

/**
 * Fetches the single, most recent exchange rate from the server.
 * @returns {Promise} A promise resolving to the latest ExchangeRate object.
 */
const getLatestRate = () => apiService.get(`${API_URL}/latest`);

/**
 * Submits a new exchange rate, which will become the latest.
 * @param {object} rateData - The data for the new rate, e.g., { uzsToRub, rubToUzs }.
 * @returns {Promise} A promise resolving to the newly saved ExchangeRate object.
 */
const updateRate = (rateData) => apiService.post(`${API_URL}/update`, rateData);


export const exchangeRateService = {
    getLatestRate,
    updateRate,
};