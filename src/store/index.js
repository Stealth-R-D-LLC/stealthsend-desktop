import { API } from '@/api/axios';
import router from '@/router';
import CryptoService from '@/services/crypto';
import { defineStore } from 'pinia';

export const useMainStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'main',
  state: () => ({
    blocks: 0,
    globalLoading: false,
    headerStyle: 'default', // has grey style on some screens and default white on most of them
    wallet: null,
    accountDetails: null,
    isAmountsHidden: false, // all amounts are visible or hidden as ***
    txWithLabels: null,

    // modals visibility
    modals: {
      receive: false,
      send: false,
      account: false,
      quickReceive: false,
    },
    resetChart: false,
    componentVisibility: {
      chart: true, // chart on dashboard,
      txDashboard: true, // tx list on dashboard
    },

    isDrawerOpened: false, // drawer (off canvas) on the right side
    currentOffCanvas: 'transaction-details', // transaction-details, recent-notifications, favourite-list, address-book, edit-contact, add-contact
    offCanvasData: null,
    addressActiveTab: 'address-book', // address-book, add-contact, edit-contact, contact-details
    sendAddress: '',
    redoAmount: 0,
    isLock: false,
    isMenuExpanded: false,
    layoutFlash: false,
  }),
  getters: {},
  actions: {
    SET_LAYOUT_FLASH(payload) {
      this.layoutFlash = payload;
    },
    SET_IS_LOCK(payload) {
      this.isLock = payload;
    },
    SET_EXPANDED_MENU(payload) {
      this.isMenuExpanded = payload;
    },
    SET_REDO_AMOUNT(payload) {
      this.redoAmount = payload;
    },
    SET_SEND_ADDRESS(payload) {
      this.sendAddress = payload;
    },
    SET_ADDRESS_ACTIVE_TAB(payload) {
      this.addressActiveTab = payload;
    },
    REFRESH_CHART(payload) {
      this.resetChart = payload;
    },
    SET_COMPONENT_VISIBILITY(component, visibility = false) {
      this.componentVisibility[component] = visibility;
    },
    SET_TX_WITH_LABELS(payload) {
      this.txWithLabels = payload;
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
    checkRpcStatus() {
      return new Promise((resolve, reject) => {
        API.post('', {
          method: 'getinfo',
        })
          .then((res) => {
            const blocks = res?.data?.result?.blocks;
            if (this.blocks && blocks) {
              this.blocks = blocks;
            }
            if (!res || !blocks) {
              router.push('/rpcerror');
            }
            if (this.blocks > blocks) {
              this.SET_RPC_STATUS(false);
              router.push('/rpcerror');
            }
            resolve();
          })
          .catch((err) => {
            console.error('RPC offline: ', err);
            router.push('/rpcerror');
            reject(err);
          });
      });
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
            reject('RPC error: ', err);
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
    getChartData(payload) {
      return new Promise((resolve, reject) => {
        API.get(`https://api.stealth.org/api/charts/homepage?period=${payload}`)
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
