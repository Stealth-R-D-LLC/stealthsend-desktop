import router from '@/router';
import axios from 'axios';
import { sanitizeUrl } from '@braintree/sanitize-url'

const API_CONFIG = {
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    common: {
      'Content-Type': 'application/json',
    },
  },
  transformRequest: [
    (data) => {
      data = {
        ...data,
        jsonrpc: '2.0',
        id: 666420,
      };
      return JSON.stringify(data);
    },
  ],
};

export const API = axios.create(API_CONFIG);
API.interceptors.request.use(
  (API_CONFIG) => {
    API_CONFIG.baseURL = sanitizeUrl(API_CONFIG.baseURL);

    if ( API_CONFIG.url && API_CONFIG.url.length > 0) {
      API_CONFIG.url = sanitizeUrl(API_CONFIG.url)
    }
    
    return API_CONFIG;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    if (response.status > 400 || response.status > 500) {
      if (JSON.parse(response.config.data).method !== 'getinfo') {
        router.push('/noconnection');
      }
    } else {
      return response;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
