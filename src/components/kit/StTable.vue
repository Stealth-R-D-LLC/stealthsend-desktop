<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th
            v-for="{ key, title, isSortable, customHeaderClass } in columns"
            :key="key"
            :class="[customHeaderClass]"
          >
            {{ title }}
            <button v-if="isSortable" @click="handleSort(key)">SORT</button>
          </th>
        </tr>
      </thead>
      <tbody name="scale">
        <template v-if="data && data.length > 0">
          <tr
            v-for="(item, index) in data"
            :key="item[identifier] ? item[identifier] : index"
            class="table__row"
            :class="{
              'table__row--is-cancelled':
                item['status'] && item['status'] === 'cancelled',
            }"
          >
            <td
              v-for="{ key, customCellClass } in columns"
              :key="key"
              :class="[customCellClass]"
            >
              <slot :name="key" :item="item" :colkey="key">
                {{ item[key] }}
              </slot>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr key="no-data">
            No data...
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'StTable',
  props: {
    identifier: {
      type: String,
      required: false,
      default: '',
    },
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  emits: ['sortChanged'],
  methods: {
    handleSort(col) {
      this.$emit('sortChanged', col)
    },
  },
}
</script>

<style lang="postcss" scoped>
.table {
  width: 100%;
  border-spacing: 0 12px;

  td {
    padding: 18px 24px;
  }

  thead {
    border-bottom: 1px solid var(--grey100);
    width: 100%;

    th {
      text-align: left;
      color: var(--grey500);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.23px;
      line-height: 20px;
      padding: 12px 24px;
    }
  }
  tbody {
    tr {
    }
  }

  .table__row {
    font-size: 14px;
    color: var(--gray1000);
      letter-spacing: 0.16px;
  line-height: 20px;
    .cell {
      &:hover {
      }
    }
  }

  .table__row {
    box-shadow: none;
    border-left: 4px solid transparent;
    transition: 0.22s;
    &:hover {
      background-color: var(--background50);
      border-color: var(--marine500);
    }
    &:last-child {
      border-bottom: 1px solid var(--grey100);
    }
  }

  /* custom classes for th and td cells */
  .cell-center {
    text-align: center !important;
  }
  .cell-right {
    text-align: right !important;
  }
}
</style>
