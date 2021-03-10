import axios from 'axios';

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
        jsonrpc: "2.0",
        id: 1,
      }
      return JSON.stringify(data)
    }
  ]
}

export const API = axios.create(API_CONFIG)
API.interceptors.request.use(
  (API_CONFIG) => {
    return API_CONFIG
  },
  (error) => {
    return Promise.reject(error)
  }
)

API.interceptors.response.use(
  (response) => {
    console.log('res', response);
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

