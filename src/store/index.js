import { API } from '@/api/axios';
import CryptoService from '@/services/crypto';
import { defineStore } from 'pinia';

export const useMainStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'main',
  state: () => ({
    globalLoading: false,
    headerStyle: 'default', // has grey style on some screens and default white on most of them
    wallet: null,
    accountDetails: null,
    isAmountsHidden: false, // all amounts are visible or hidden as ***

    // modals visibility
    modals: {
      receive: false,
      send: false,
    },
    componentVisibility: {
      chart: true, // chart on dashboard,
      txDashboard: true, // tx list on dashboard
    },

    isDrawerOpened: false, // drawer (off canvas) on the right side
    currentOffCanvas: 'transaction-details', // transaction-details, recent-notifications, favourite-list, address-book, edit-contact, add-contact
    offCanvasData: null,
    addressActiveTab: 'address-book', // address-book, add-contact, edit-contact, contact-details
  }),
  getters: {},
  actions: {
    SET_ADDRESS_ACTIVE_TAB(payload) {
      this.addressActiveTab = payload;
    },
    SET_COMPONENT_VISIBILITY(component, visibility = false) {
      this.componentVisibility[component] = visibility;
    },
    SET_OFF_CANVAS_DATA(payload) {
      this.offCanvasData = payload;
    },
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
    SET_CURRENT_CANVAS(payload) {
      this.currentOffCanvas = payload;
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
            CryptoService.constraints.XST_USD = res.data.priceUsd;
            CryptoService.constraints.XST_BTC = res.data.priceBTC;
            CryptoService.constraints.changePercent24Hr =
              res.data.changePercent24Hr;
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getChartData() {
      return new Promise((resolve, reject) => {
        API.get('https://api.stealth.org/api/charts/homepage?period=1w')
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
