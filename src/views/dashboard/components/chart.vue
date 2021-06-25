<template>
  <div>
    <div class="filter-period">
      <a
        :class="{ active: currentPeriod === '1d' }"
        @click="changeChartPeriod('1d')"
        >1d</a
      >
      <a
        :class="{ active: currentPeriod === '3d' }"
        @click="changeChartPeriod('3d')"
        >3d</a
      >
      <a
        :class="{ active: currentPeriod === '1w' }"
        @click="changeChartPeriod('1w')"
        >1w</a
      >
      <a
        :class="{ active: currentPeriod === '1m' }"
        @click="changeChartPeriod('1M')"
        >1m</a
      >
      <a
        :class="{ active: currentPeriod === 'all' }"
        @click="changeChartPeriod('all')"
        >All</a
      >
    </div>
    <template v-if="!refreshChart">
      <div class="st-dashboard-chart"></div>
    </template>
  </div>
</template>

<script>
import ApexCharts from 'apexcharts';
import { ref, onMounted } from '@vue/runtime-core';
/* import useHelpers from '@/composables/useHelpers'; */
import { useMainStore } from '@/store';

export default {
  name: 'StDashboardChart',
  setup() {
    /* const { formatAmount } = useHelpers(); */
    const mainStore = useMainStore();
    const currentPeriod = ref('1w');
    const refreshChart = ref(false);

    onMounted(() => {
      changeChartPeriod();
    });
    function changeChartPeriod(period = '1w') {
      currentPeriod.value = period;
      refreshChart.value = true;
      mainStore.getChartData(currentPeriod.value).then((res) => {
        refreshChart.value = false;
        setTimeout(() => {
          var options = {
            chart: {
              type: 'area',
              toolbar: {
                show: false,
              },
              width: '100%',
              height: mainStore.componentVisibility.txDashboard
                ? '400px'
                : '100%',
              offsetX: -5,
              zoom: {
                enabled: false,
              },
              selection: {
                enabled: false,
              },
              animations: {
                enabled: true,
                easing: 'linear',
                speed: 800,
                animateGradually: {
                  enabled: false,
                  delay: 150,
                },
                dynamicAnimation: {
                  enabled: true,
                  speed: 350,
                },
              },
            },
            colors: ['#4E00F6'],
            dataLabels: {
              enabled: false,
              enabledOnSeries: false,
            },
            stroke: {
              colors: ['#4E00F6', '#A8F9DC'],
              curve: 'smooth',
              width: 1.95,
            },
            fill: {
              colors: ['#4E00F6', '#A8F9DC'],
              type: 'gradient',
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.1,
                opacityTo: 0.8,
                stops: [0, 90, 100],
              },
            },
            xaxis: {
              forceNiceScale: true,
              categories: [],
              type: 'datetime',
              labels: {
                format: 'dd MMM',
                showDuplicates: false,
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
            },
            yaxis: {
              /* forceNiceScale: true, */
              labels: {
                show: true,
                /* formatter: function (value) {
                return formatAmount(value, false, 4);
              }, */
                formatter: function (value) {
                  return value.toFixed(2);
                },
              },
            },
            legend: {
              show: false,
            },
            grid: {
              show: false,
            },
            tooltip: {
              enabled: true,
              fillSeriesColor: false,
              marker: {
                show: true,
              },
              style: {
                fontFamily: 'noto-sans, Helvetica Neue, Arial, sans-serif',
              },
              y: {
                formatter: function (value) {
                  return parseFloat(value.toFixed(8));
                },
              },
            },
            noData: {
              text: 'Loading...',
              align: 'center',
              verticalAlign: 'middle',
            },
            series: [],
          };
          options.series = res.series;
          options.xaxis.categories = res.options.xaxis.categories;
          var chart = new ApexCharts(
            document.querySelector('.st-dashboard-chart'),
            options
          );
          chart.render();
        }, 1);
      });
    }
    return {
      refreshChart,
      changeChartPeriod,
      currentPeriod,
    };
  },
};
</script>

<style scoped>
.full-height .st-dashboard-chart {
  height: calc(100vh - 220px);
}
.st-dashboard-chart {
  height: 400px;
}
.filter-period {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}
.filter-period a + a {
  margin-left: 8px;
}
.filter-period a {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--secondary-font);
  padding: 4px 8px;
  background: linear-gradient(
      153.02deg,
      rgba(250, 249, 252, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.23%
    ),
    #faf9fc;
  border: 1px solid rgba(229, 228, 232, 0.15);
  box-sizing: border-box;
  border-radius: 6px;
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0.16px;
  transition: 0.3s;
}
.filter-period a:hover,
.filter-period a.active {
  background: linear-gradient(
      153.43deg,
      rgba(184, 183, 187, 0.15) 0%,
      rgba(229, 228, 232, 0.15) 83.33%
    ),
    #e5e4e8;
  border: 1px solid rgba(207, 205, 209, 0.25);
  color: var(--marine500);
  text-shadow: 0.6px 0px 0px var(--marine500);
}
</style>
