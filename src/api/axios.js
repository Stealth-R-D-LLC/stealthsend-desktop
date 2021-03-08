import axios from 'axios'

const API_CONFIG = {
    baseURL: 'https://jsonplaceholder.typicode.com/',
//   withCredentials: true,
//   xsrfCookieName: 'XCSRF-TOKEN',
//   xsrfHeaderName: 'x-csrf-token',
//   headers: {
//     common: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//   },
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
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

