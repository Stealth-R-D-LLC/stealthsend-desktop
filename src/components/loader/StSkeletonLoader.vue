<template>
  <div class="loader">
    <template v-if="props.type === 'cards'">
      <div v-for="card in 10" :key="card" class="loader-cards">
        <div class="loader-cards__inner">
          <div class="loader-cards__inner--header">
            <div class="label gradient" />
            <div class="icon gradient" />
          </div>
          <div class="loader-cards__inner--footer">
            <div class="amount gradient" />
            <div class="fiat-amount gradient" />
          </div>
        </div>
      </div>
    </template>
    <template v-if="props.type === 'transactions'">
      <table
        class="loader-transactions"
        :class="{
          'loader-transactions-dashboard': $route.path === '/dashboard',
        }"
      >
        <thead>
          <th v-for="col in 8" :key="col" class="th">
            <div class="title gradient" />
          </th>
        </thead>
        <tbody>
          <tr v-for="row in 8" :key="row">
            <td v-for="rowitem in 8" :key="rowitem" class="td">
              <div class="info gradient"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="props.type === 'accounts'">
      <div class="loader-accounts">
        <div class="main-title">
          <div class="main-title__inner gradient"></div>
        </div>
        <div class="accounts">
          <div class="accounts__inner" v-for="account in 12" :key="account">
            <div class="accounts__inner-header">
              <div class="title gradient" />
              <div class="title-icons">
                <div class="icon gradient" />
                <div class="icon gradient" />
              </div>
            </div>
            <div class="accounts__inner-content">
              <div class="amount gradient" />
              <div class="fiat-amount gradient" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="props.type === 'tx-details'">
    <div class="loader-tx">
      <div class="loader-tx__item">
        <div class="title gradient" />
        <div class="loader-tx__item-content">
          <div class="icon gradient" />
          <div class="info gradient" />
        </div>
      </div>
      <div class="loader-tx__item">
        <div class="title gradient" />
        <div class="loader-tx__item-content">
          <div class="info gradient" />
        </div>
      </div>
      <div class="loader-tx__item">
        <div class="title gradient" />
        <div class="loader-tx__item-content">
          <div class="info gradient" />
        </div>
      </div>
      <div class="loader-tx__item">
        <div class="title gradient" />
        <div class="loader-tx__item-content">
          <div class="info gradient" />
        </div>
      </div>
      <div class="loader-tx__item">
        <div class="title gradient" />
        <div class="loader-tx__item-content">
          <div class="info gradient" />
        </div>
      </div>
      <div class="loader-tx__item loader-tx__item--grid">
        <div>
          <div class="title gradient" />
          <div class="loader-tx__item-content">
            <div class="info gradient" />
          </div>
        </div>
        <div>
          <div class="title gradient" />
        <div class="loader-tx__item-content">
          <div class="info gradient" />
        </div>
        </div>
      </div>
      <div class="loader-tx__item">
        <div class="title gradient" />
        <div class="loader-tx__item-content">
          <div class="info gradient" />
        </div>
      </div>
      <div class="loader-tx__about gradient" />
    </div>
    </template>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.gradient {
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: #eaeaea;
  background: linear-gradient(to right, #eaeaea 8%, #d5d5d5 38%, #eaeaea 54%);
  background-size: 1000px 640px;
  position: relative;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}

/* CARDS */
.loader .loader-cards {
  width: 100%;
  background: #fefefe;
  border: 1px solid var(--purple50);
  box-shadow: 0px 8px 24px -8px rgb(34 3 101 / 10%);
  border-radius: 2px;
}
.loader .loader-cards:not(:last-child) {
  margin-bottom: 10px;
}

.loader .loader-cards .loader-cards__inner {
  padding: 16px 20px 24px;
}
.loader .loader-cards .loader-cards__inner .loader-cards__inner--header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.loader .loader-cards .loader-cards__inner .loader-cards__inner--header .label {
  margin-right: 24px;
  width: 100%;
  height: 24px;
  max-width: 160px;
}
.loader .loader-cards .loader-cards__inner .loader-cards__inner--header .icon {
  width: 12px;
  height: 10px;
}

.loader
  .loader-cards
  .loader-cards__inner
  .loader-cards__inner--footer
  .amount {
  width: 100%;
  max-width: 100px;
  height: 20px;
  margin-bottom: 10px;
}
.loader
  .loader-cards
  .loader-cards__inner
  .loader-cards__inner--footer
  .fiat-amount {
  width: 100%;
  max-width: 80px;
  height: 16px;
}

/* TRANSACTIONS */
.loader-transactions {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0 12px;
}
.loader-transactions thead {
  border-bottom: 1px solid var(--grey100);
}
.loader-transactions thead .th {
  padding: 18px 6px;
}
.loader-transactions thead .th .title {
  width: 100%;
  max-width: 50px;
  height: 17px;
}
.loader-transactions thead .th:last-child {
  opacity: 0;
  width: 62px;
}
.loader-transactions thead .th:nth-last-child(-n + 3) .title,
.loader-transactions tbody tr .td:nth-last-child(-n + 3) .info {
  margin-left: auto;
}
.loader-transactions tbody tr .td:first-child {
  padding: 18px 10px 18px 0;
}
.loader-transactions tbody tr .td {
  padding: 18px 6px;
  border-bottom: 1px solid var(--grey100);
}
.loader-transactions tbody tr .td:last-child {
  padding: 18px 0 18px 10px;
}
.loader-transactions tbody tr .td .info {
  width: 98px;
  height: 24px;
}
.loader-transactions tbody tr .td:nth-child(1) .info {
  width: 98px;
}
.loader-transactions tbody tr .td:nth-child(2) .info {
  width: 68px;
}
.loader-transactions tbody tr .td:nth-child(3) .info {
  width: 104px;
}
.loader-transactions tbody tr .td:nth-child(4) .info {
  width: 281px;
}
.loader-transactions tbody tr .td:nth-child(5) .info {
  width: 136px;
}
.loader-transactions tbody tr .td:nth-child(6) .info {
  width: 118px;
}
.loader-transactions tbody tr .td:nth-child(7) .info {
  width: 118px;
}
.loader-transactions tbody tr .td:nth-child(8) .info {
  width: 24px;
  margin-left: 39px;
}

@media only screen and (max-width: 1299px) {
  .loader-transactions tbody tr .td:nth-child(4),
  .loader-transactions thead .th:nth-child(4) {
    display: none;
  }
  .loader-transactions tbody tr .td:first-child {
    width: 103px;
  }
  .loader-transactions-dashboard thead .th:nth-child(5) {
    display: none;
  }
}

.loader-transactions-dashboard thead .th:nth-child(4),
.loader-transactions-dashboard tbody tr .td:nth-child(4) {
  display: none !important;
}
.loader-transactions-dashboard tbody tr .td:nth-child(1) .info {
  width: 25px;
}
.loader-transactions-dashboard tbody tr .td:first-child {
  width: 20px;
}

/* ACCOUNTS */

.loader-accounts .main-title {
  padding: 24px 28px 88px;
  background: #f4f3f6;
  margin: 0 -28px;
}
.loader-accounts .main-title .main-title__inner {
  margin-top: 5px;
  width: 100%;
  max-width: 120px;
  height: 24px;
}
.loader-accounts .accounts {
  position: relative;
  top: -60px;
  display: grid;
  grid-template-columns: repeat(4, 4fr);
  grid-gap: 28px 20px;
}
.loader-accounts .accounts .accounts__inner {
  min-height: 188px;
  box-sizing: border-box;
  position: relative;
  background: var(--background0);
  border: 1px solid var(--purple50);
  box-shadow: 0px 8px 24px -8px rgb(34 3 101 / 10%);
  border-radius: 2px;
  padding: 18px 20px 24px;
}

.loader-accounts .accounts .accounts__inner .accounts__inner-header {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: 11fr auto;
  grid-gap: 0 10px;
  align-items: center;
}
.loader-accounts .accounts .accounts__inner .accounts__inner-header .title {
  width: 100%;
  max-width: 120px;
  height: 24px;
}
.loader-accounts
  .accounts
  .accounts__inner
  .accounts__inner-header
  .title-icons {
  display: flex;
  align-items: center;
}
.loader-accounts
  .accounts
  .accounts__inner
  .accounts__inner-header
  .title-icons
  .icon {
  width: 24px;
  height: 24px;
}
.loader-accounts
  .accounts
  .accounts__inner
  .accounts__inner-header
  .title-icons
  .icon:first-child {
  margin-right: 24px;
}
.loader-accounts .accounts .accounts__inner .accounts__inner-content .amount {
  width: 100%;
  max-width: 120px;
  height: 20px;
  margin-bottom: 10px;
}
.loader-accounts
  .accounts
  .accounts__inner
  .accounts__inner-content
  .fiat-amount {
  width: 100%;
  max-width: 80px;
  height: 16px;
}

/* TX DETAILS */
.loader-tx {
  padding-top: 4px;
}
.loader-tx .loader-tx__item {
  border-bottom: 1px solid var(--grey100);
  padding: 16px 0;
}
.loader-tx .loader-tx__item.loader-tx__item--grid {
  display: grid;
  grid-template-columns: 6fr 6fr;
  grid-gap: 32px;
}
.loader-tx .loader-tx__item .loader-tx__item-content {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.loader-tx .loader-tx__item .title {
  height: 12px;
  width: 100px;
}
.loader-tx .loader-tx__item .loader-tx__item-content .icon {
  height: 24px;
  min-width: 24px;
  width: 24px;
  border-radius: 24px;
  margin-right: 12px;
}

.loader-tx .loader-tx__item .loader-tx__item-content .info {
  height: 12px;
  width: 100%;
}
.loader-tx .loader-tx__about {
  margin: 22px auto;
  height: 24px;
  width: 100%;
  max-width: 168px;
}
</style>
