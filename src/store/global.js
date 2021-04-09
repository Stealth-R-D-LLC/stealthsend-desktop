import { API } from '@/api/axios'
import { reactive, readonly } from 'vue'

const state = reactive({
  globalLoading: false,
  wallet: null,
  accounts: [],
  accountDetails: null
})

const setWallet = (payload) => state.wallet = payload;
const setAccounts = (payload) => state.accounts = payload;
const appendAccount = (payload) => state.accounts.push(payload);
const SET_ACCOUNT_DETAILS = (payload) => state.accountDetails = payload;

const rpc = (method, payload) => {
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
};

/**
 * {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getaddressinfo",
    "params": [
        "mtS8n7jnjpS9upnQtvKpHNxxDeeXiFm5cy"
    ]
}
 */
// TODO: Remove later (intended for testing rpc calls)
// console.log('rpc', rpc("getaddressinfo", ["miM6d6S71YX9JrRgVfKUeFxGpqdd8o3fKD"]));
// getnewaddress
// "result": "mgKQcbQ2pGJRHKAi9T6icaH8QtZReiTPvT"

const startGlobalLoading = () => state.globalLoading = true;
const stopGlobalLoading = () => state.globalLoading = false;

// import globalState from @/store/global
// readonly ensures that globalState.state.test++ is not possible
export default {
  state: readonly(state),
  startGlobalLoading: startGlobalLoading,
  stopGlobalLoading: stopGlobalLoading,
  setAccounts: setAccounts,
  appendAccount: appendAccount,
  setWallet: setWallet,
  rpc: rpc,
  setAccountDetails: SET_ACCOUNT_DETAILS,
};
