import { API } from '@/api/axios'
import { reactive, readonly } from 'vue'

const state = reactive({
  test: 123,
  globalLoading: false,
  wallet: null,
  accounts: [],
  accountDetails: null
})

const incrementTest = () => {
  state.test++
}

const setWallet = (payload) => {
  state.wallet = payload
}
const setAccounts = (payload) => {
  state.accounts = payload
}
const appendAccount = (payload) => {
  state.accounts.push(payload)
}

const SET_ACCOUNT_DETAILS = (payload) => {
  state.accountDetails = payload
}

const requestTest = () => {
  return new Promise((resolve, reject) => {
    API.get('todos/1')
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const rpc = (method, payload) => {
  return new Promise((resolve, reject) => {
    API.post('', {
      method: method,
      params: payload
    })
      .then((res) => {
        console.log(`RPC response (${method}): `, res.data.result);
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

const startGlobalLoading = () => {
  state.globalLoading = true
}

const stopGlobalLoading = () => {
  state.globalLoading = false
}

// import globalState from @/store/global
// readonly ensures that globalState.state.test++ is not possible
export default {
  state: readonly(state),
  incrementTest: incrementTest,
  requestTest: requestTest,
  startGlobalLoading: startGlobalLoading,
  stopGlobalLoading: stopGlobalLoading,
  setAccounts: setAccounts,
  appendAccount: appendAccount,
  setWallet: setWallet,
  rpc: rpc,
  setAccountDetails: SET_ACCOUNT_DETAILS,
}
