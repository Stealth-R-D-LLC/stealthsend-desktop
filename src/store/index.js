import { API } from '@/api/axios';
import { defineStore } from 'pinia';
import CryptoService from '@/services/crypto';

export const useMainStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'main',
  state: () => ({
    globalLoading: false,
    headerStyle: 'default', // has grey style on some screens and default white on most of them
    wallet: null,
    accountDetails: null,
    isAmountsHidden: false,

    // modals visibility
    modals: {
      receive: false,
      send: false,
    },
    isDrawerOpened: false,
  }),
  getters: {},
  actions: {
    SET_MODAL_VISIBILITY(modal, visibility) {
      this.modals[modal] = visibility;
    },
    SET_ACCOUNT_DETAILS(payload) {
      this.accountDetails = payload;
    },
    SET_AMOUNTS_HIDDEN(payload) {
      this.isAmountsHidden = payload;
    },
    SET_HEADER_STYLE(payload) {
      if (['default', 'grey'].includes(payload)) {
        this.headerStyle = payload;
        return;
      }
      console.error('SET_HEADER_STYLE: Invalid header style.');
    },
    START_GLOBAL_LOADING() {
      this.globalLoading = true;
    },
    STOP_GLOBAL_LOADING() {
      this.globalLoading = false;
    },
    TOGGLE_DRAWER(payload = false) {
      this.isDrawerOpened = payload;
    },

    rpc(method, payload) {
      return new Promise((resolve, reject) => {
        API.post('', {
          method: method,
          params: payload,
        })
          .then((res) => {
            console.log(`RPC response (${method}): `, res.data.result);
            resolve(res.data.result);
          })
          .catch((err) => {
            console.error('RPC error: ', err);
            reject(err.response.data.error.message);
          });
      });
    },
    getMarketInfo() {
      return new Promise((resolve, reject) => {
        API.get('https://api.stealth.org/api/market/info')
          .then((res) => {
            console.log('market info response: ', res);
            CryptoService.constraints.XST_USD = res.data.priceUsd;
            CryptoService.constraints.XST_BTC = res.data.priceBTC;
            CryptoService.constraints.changePercentage24Hr =
              res.data.changePercentage24Hr;
            resolve(res.data);
          })
          .catch((err) => {
            console.log('get market info error: ', err);
            reject(err);
          });
      });
    },
    getChartData() {
      return new Promise((resolve, reject) => {
        API.get('https://api.stealth.org/api/charts/homepage?period=1d')
          .then((res) => {
            console.log('getChartData response: ', res);
            resolve(res.data);
          })
          .catch((err) => {
            console.log('getChartData error: ', err);
            reject(err);
          });
      });
    },
  },
});
