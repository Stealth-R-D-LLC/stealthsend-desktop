<template>
  <div class="uikit-container">
    <h1>UI Kit</h1>
    <h2>Buttons</h2>
    <StButton color="secondary" @click="clickHandler('aaaaa')">Dash</StButton>
    <StButton @click="clickHandler('bbbbbaaaaaaaaaaaaaaaa')">Settings</StButton>
    <br />
    <br />
    <h2>Inputs</h2>
    <StInput v-model="bla" placeholder="aaaa"></StInput>
    <StInput
      v-model="bla"
      has-error
      :error-messages="'custom error message'"
    ></StInput>
    <br />
    <br />
    <h2>Link</h2>
    <StLink to="settings">hoveraj me burki</StLink>
    <br />
    <br />
    <StLink @click="clickHandler('bla')">ovaj samo ima emit</StLink>
    <h2>Radio</h2>
    <br />
    <br />
    <StRadio
      :id="'uikitradio1'"
      v-model="radioValue"
      :name="'uikitradio'"
      :label="'option 1'"
      >option 1</StRadio
    >
    <StRadio
      :id="'uikitradio2'"
      v-model="radioValue"
      :name="'uikitradio'"
      :label="'option 2'"
      >option 2</StRadio
    >
    <StRadio
      :id="'uikitradio3'"
      v-model="radioValue"
      :name="'uikitradio'"
      :label="'option 3'"
      >option 3</StRadio
    >
    {{ radioValue }}
    <br />
    <br />
    <h2>Checkbox</h2>

    <StCheckbox v-model="checkboxPrvi"
      >checkbox usrani {{ checkboxPrvi }}</StCheckbox
    >
    <StCheckbox
      >checkbox usrani veliki Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. Nemo iure doloremque accusantium, beatae doloribus
      minima? Ut voluptas accusantium accusamus repellendus? Perferendis rerum
      voluptates sequi incidunt, magnam quidem in. Magni, illum?Lorem ipsum
      dolor sit amet consectetur adipisicing elit. Minus itaque eos consectetur
      perferendis laborum facere expedita, iste quod voluptatibus officiis
      dolorem delectus accusantium aut vero fugiat adipisci eaque perspiciatis
      beatae!</StCheckbox
    >
    <br /><br />
    <h2>Modal</h2>
    <StModal :visible="showModal" @close="showModal = false">
      <template #header> Modal title </template>
      <template #body>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
        aspernatur? Necessitatibus hic a ullam commodi! Nostrum deserunt facere
        ut ducimus unde in, animi qui soluta, omnis praesentium, incidunt
        voluptatum quae.
      </template>
      <template #footer>
        <StButton color="secondary" @click="showModal = false">Cancel</StButton>
        <StButton @click="showModal = false">Submit</StButton>
      </template>
    </StModal>
    <button @click="showModal = true">Show modal</button>
    <br /><br />
        <h2>Select</h2>
    <Multiselect
      v-model="multiselectValue"
      :can-deselect="false"
      :options="multiselectOptions"
    />
    <br />
    <br />
    <h2>Table</h2>
    <StTable :data="tableData" :columns="tableColumns"></StTable>
    <StPagination
      :total="Number(85)"
      :page-size="Number(10)"
      :current-page="Number(9)"
    ></StPagination>
    <br /><br />
    <h2>Status</h2>
    <StStatus type="red">Missed</StStatus>
    <StStatus type="green">Produced</StStatus>
    <StStatus type="orange">Late</StStatus>
    <StStatus type="empty">Scheduled</StStatus>
    <br /><br />
    <h2>Dropdown</h2>
    <StDropdown
      :items="[
        { to: 'settings', label: 'Settings' },
        { to: 'dashboard', label: 'Dash' },
      ]"
      >click me</StDropdown
    >
    <br /><br />
    <h2>Copy to clipboard</h2>
    <StTooltip
      :tooltip-text="copyPending ? 'Copied to clipboard!' : 'Click to copy'"
    >
      <StCopyToClipboard
        content="kopirani string"
        @click="handleCopy"
      ></StCopyToClipboard>
    </StTooltip>
    <br />
    <br />
    <h2>Tooltip</h2>
    <StTooltip position="left" tooltip-text="aaaaa">
      <button>left</button>
    </StTooltip>
    <StTooltip tooltip-text="aaaaa">
      <button>top</button>
    </StTooltip>
    <StTooltip position="bottom" tooltip-text="aaaaa">
      <button>bottom</button>
    </StTooltip>
    <StTooltip position="right" tooltip-text="aaaaa">
      <button>right</button>
    </StTooltip>
    <br />
    <br />
    <h2>Global loading</h2>
    <button @click="toggleLoading">Trigger global loading</button>
    <StLoading :visibility="isLoading"></StLoading>
  </div>
</template>

<script>
import StButton from '/~/components/kit/StButton.vue'
import StInput from '/~/components/kit/StInput.vue'
import StLink from '/~/components/kit/StLink.vue'
import StRadio from '/~/components/kit/StRadio.vue'
import StCheckbox from '/~/components/kit/StCheckbox.vue'
import StModal from '/~/components/kit/StModal.vue'
import StTable from '/~/components/kit/StTable.vue'
import StStatus from '/~/components/kit/StStatus.vue'
import StPagination from '/~/components/kit/StPagination.vue'
import StDropdown from '/~/components/kit/StDropdown.vue'
import StCopyToClipboard from '/~/components/kit/StClipboard.vue'
import StTooltip from '/~/components/kit/StTooltip.vue'
import StLoading from '/~/components/kit/StLoading.vue'
import Multiselect from '@vueform/multiselect'

import { ref } from 'vue'
export default {
  components: {
    StButton,
    StInput,
    StLink,
    StRadio,
    StCheckbox,
    StModal,
    StTable,
    StStatus,
    StPagination,
    StDropdown,
    StCopyToClipboard,
    StTooltip,
    Multiselect,
    StLoading
  },
  setup() {
    const tableData = ref([
      {
        address: 'RxLvZSm4gMmzoS5VyJxm24FaGDRJjVPv9z',
        protocol: 62200,
        subVersion: '2.2.0',
        blockHeight: '12345678',
      },
      {
        address: '4b5t45z45zb45zb45bz45bz45zb45zb454',
        protocol: 62200,
        subVersion: '2.2.0',
        blockHeight: '556756756',
      },
      {
        address: '56un56un56u56un56un56u5u56n56un56u',
        protocol: 62200,
        subVersion: '2.2.0',
        blockHeight: '7878787887',
      },
      {
        address: '67imi67im67im67im67i67i67i6767m6mm',
        protocol: 62200,
        subVersion: '2.2.0',
        blockHeight: '6776676767',
      },
      {
        address: 'rbrthrthrhrthrhthbrbhrthbrbthrtbhr ',
        protocol: 62200,
        subVersion: '2.2.0',
        blockHeight: '454353353535',
      },
      {
        address: 'vbbcvbcvbcvbcvbcbcvbvbcvbcvbcvbcvb',
        protocol: 62200,
        subVersion: '2.2.0',
        blockHeight: '67677667',
      },
      {
        address: 'mbnnmbmnbmbnmbnmbnmbnmbmbnmbnmbnmm',
        protocol: 62200,
        subVersion: '2.2.0',
        blockHeight: '7676767',
      },
      {
        address: 'qweqeqweqqwewqewqeqeqewqweqwewqqwe',
        protocol: 62200,
        subVersion: '2.2.0',
        blockHeight: '12345678',
      },
    ])
    const tableColumns = ref([
      { key: 'address', title: 'Address' },
      { key: 'protocol', title: 'Protocol' },
      {
        key: 'subVersion',
        title: 'Sub-version',
        customCellClass: 'cell-center',
        customHeaderClass: 'cell-center',
      },
      { key: 'blockHeight', title: 'Blockheight' },
    ])
    const bla = ref('')
    let checkboxPrvi = ref(false)
    let showModal = ref(false)

    let radioValue = ref('')
    function clickHandler(test) {
      console.log('---> ', test)
    }

    let copyPending = ref(false)
    function handleCopy() {
      copyPending.value = true
      setTimeout(() => {
        copyPending.value = false
      }, 2000)
    }

    let multiselectValue = ref(null)
    let multiselectOptions = ref(['Batman', 'Robin', 'Joker'])
    const isLoading = ref(false);

    function toggleLoading() {
      isLoading.value = true;
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    }

    return {
      clickHandler,
      bla,
      radioValue,
      checkboxPrvi,
      showModal,
      tableData,
      tableColumns,
      handleCopy,
      copyPending,
      multiselectValue,
      multiselectOptions,
      isLoading,
      toggleLoading
    }
  },
}
</script>

<style scoped></style>
