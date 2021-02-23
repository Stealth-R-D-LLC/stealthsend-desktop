import { API } from '@/api/axios'
import { reactive, readonly } from 'vue'

const state = reactive({
  test: 123,
})

const incrementTest = () => {
  state.test++
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

// import globalState from @/store/global
// readonly ensures that globalState.state.test++ is not possible
export default {
  state: readonly(state),
  incrementTest: incrementTest,
  requestTest: requestTest,
}
