import { reactive, readonly } from 'vue'

const state = reactive({
  test: 123,
})

const incrementTest = () => {
  state.test++
}

// import globalState from /~/store/global
// readonly ensures that globalState.state.test++ is not possible
export default {
  state: readonly(state),
  incrementTest: incrementTest,
}
