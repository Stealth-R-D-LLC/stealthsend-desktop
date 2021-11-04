import { API } from '@/api/axios';
import router from '@/router';
import CryptoService from '@/services/crypto';
import { defineStore } from 'pinia';
import DOMPurify from 'dompurify';

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
    redoAccount: '',
    redoAmount: 0,
    isLock: false,
    isMenuExpanded: false,
    layoutFlash: false,
    isFeeless: true,
    currentPeriod: { label: '3d', value: 3 },
    currentDirection: { label: 'All', value: '' },

    pendingTransactions: [],
    // {"account":"123123123","account_balance_change":1.05,"amount":1.06,"txinfo":{"blocktime":1636028004},"blocktime":1636028004,"txid":"2cd2b9277568066a2dd53fbee49635839829df804794101cdd9d450ae8c15e11","isPending":true}
  }),
  getters: {},
  actions: {
    ADD_PENDING_TRANSACTION(tx) {
      this.pendingTransactions.push(tx);
      // this.wallet.txs.push(tx);
    },
    REMOVE_PENDING_TRANSACTION(txid) {
      this.pendingTransactions = this.pendingTransactions.filter(
        (el) => el.txid !== txid
      );
    },
    SET_CURRENT_PERIOD(payload) {
      this.currentPeriod = payload;
    },
    SET_CURRENT_DIRECTION(payload) {
      this.currentDirection = payload;
    },
    SET_WALLET(payload) {
      this.wallet = payload;
    },
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
    SET_FEELESS(payload) {
      this.isFeeless = payload;
    },
    SET_SEND_ADDRESS(payload) {
      this.sendAddress = payload;
    },
    SET_REDO_ACCOUNT(payload) {
      this.redoAccount = payload;
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
    getTransactionInfo(txId) {
      return new Promise((resolve, reject) => {
        this.rpc('gettransaction', [txId])
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getblock(hash) {
      return new Promise((resolve, reject) => {
        this.rpc('getblock', [hash])
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getaddressinputs(address, from, to) {
      return new Promise((resolve, reject) => {
        this.rpc('getaddressinputs', [address, from, to])
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    async getTxFee(txId) {
      let transaction = null;
      await this.getTransactionInfo(txId)
        .then((res) => {
          transaction = res;
        })
        .catch((err) => {
          console.log(err);
        });

      transaction.vin = await Promise.all(
        transaction.vin
          .map((item) => {
            return new Promise((resolve, reject) => {
              if (!item.txid) {
                return resolve(item);
              }

              this.getTransactionInfo(item.txid)
                .then((res) => ({
                  ...res.vout[item.vout],
                  blockhash: res.blockhash,
                }))
                .then((output) => resolve({ ...item, output }))
                .catch(reject);
            });
          })
          .concat([this.getblock(transaction.blockhash)])
      );

      const block = transaction.vin.pop();

      // Here we will find all the address inputs
      // that have referenced this transaction.
      const spent = // Loop each output
      (
        await Promise.all(
          transaction.vout.map((item) => {
            return new Promise((resolveFirst, rejectFirst) => {
              Promise.all(
                // Loop each output address and gather its inputs
                // Check if any of the inputs has referenced this tx
                (item.scriptPubKey.addresses || []).map((address) => {
                  return new Promise((resolveSecond, rejectSecond) => {
                    this.getaddressinputs(address, 1, 99999)
                      .then((res) => {
                        const input =
                          res.filter(
                            (i) => i.prev_txid === transaction.txid
                          )[0] || null;

                        // We will resolve here for each address
                        // input that has referenced this tx
                        resolveSecond({
                          address,
                          input,
                        });
                      })
                      .catch(rejectSecond);
                  });
                })
              )
                .then(resolveFirst)
                .catch(rejectFirst);
            });
          })
        )
      ).flat();

      // For "ease" of use we will create an object with address as key
      // and input as value
      const vOutInputs = {};
      for (const input of spent) {
        vOutInputs[input.address] = input.input;
      }

      // Here we will loop again through the outputs...
      for (let i = 0; i < transaction.vout.length; i++) {
        // And then output addresses...
        for (
          let j = 0;
          j < (transaction.vout[i].scriptPubKey.addresses || []).length;
          j++
        ) {
          // We will need this "spent" information on the output object,
          // and not on the address itself, so we will create a new array on
          // the root of the output item and attach the input info.
          transaction.vout[i].inputs = transaction.vout[i].inputs || [];
          transaction.vout[i].inputs.push({
            address: transaction.vout[i].scriptPubKey.addresses[j],
            input:
              vOutInputs[transaction.vout[i].scriptPubKey.addresses[j]] || null,
          });
        }
      }

      return {
        ...transaction,
        block,
      };
    },
    rpc(method, payload) {
      return new Promise((resolve, reject) => {
        API.post('', {
          method: method,
          params: payload,
        })
          .then((res) => {
            //console.log(`RPC response (${method}): `, res.data.result);
            resolve(res.data.result);
          })
          .catch((err) => {
            console.error('RPC error: ', err);
            reject('RPC error: ', err);
          });
      });
    },
    rpcMulti(method, payload) {
      return new Promise((resolve, reject) => {
        const requestArray = [];
        payload.forEach((payloadItem) => {
          requestArray.push({
            method,
            params: payloadItem,
          });
        });

        const perChunk = 30; // if more than 30 requests, chunk into 30 size arrays
        let requestsChunked = requestArray.reduce(
          (resultArray, item, index) => {
            const chunkIndex = Math.floor(index / perChunk);
            if (!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = []; // start a new chunk
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
          },
          []
        );

        const promises = [];

        requestsChunked.forEach((requestChunk) => {
          promises.push(API.post('', requestChunk));
        });
        return Promise.all(promises)
          .then((result) => {
            const mergedResult = [];
            result.forEach((res) => {
              mergedResult.push(...res.data.map((item) => item.result));
            });
            resolve(mergedResult);
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
            res.data = JSON.parse(DOMPurify.sanitize(JSON.stringify(res.data)));
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
            res.data = JSON.parse(DOMPurify.sanitize(JSON.stringify(res.data)));
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
});
