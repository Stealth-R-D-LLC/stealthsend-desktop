import { API } from '@/api/axios';
import { defineStore } from 'pinia';

export const useMainStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'main',
  state: () => ({
    globalLoading: false,
    wallet: null,
    accountDetails: null,
    isAmountsHidden: false,
  }),
  getters: {},
  actions: {
    SET_ACCOUNT_DETAILS(payload) {
        this.accountDetails = payload
    },
    SET_AMOUNTS_HIDDEN(payload) {
        this.isAmountsHidden = payload
    },
    startGlobalLoading() {
        this.globalLoading = true
    },
    stopGlobalLoading() {
        this.globalLoading = false
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
    }

  },
})