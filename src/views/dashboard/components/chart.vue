<template>
  <div>
    <div class="filter-period">
      <a
        v-for="filter in $route.name === 'Dashboard' ? filters : complexFilters"
        :key="filter.id"
        :class="{ active: currentPeriod === filter.id }"
        @click="changeChartPeriod(filter.id)"
        >{{ filter.period }}</a
      >
    </div>
    <template v-if="!refreshChart">
      <div class="chart-max">{{ maxValue }}</div>
      <div class="st-dashboard-chart"></div>
      <div class="chart-min">{{ minValue }}</div>
    </template>
  </div>
</template>

<script>
import ApexCharts from 'apexcharts';
import { ref, onMounted } from '@vue/runtime-core';
import useHelpers from '@/composables/useHelpers';
import { useMainStore } from '@/store';
import format from 'date-fns/format';

export default {
  name: 'StDashboardChart',
  setup() {
    const { formatAmount } = useHelpers();
    const mainStore = useMainStore();
    const currentPeriod = ref('1M');
    const refreshChart = ref(false);
    const minValue = ref(0);
    const maxValue = ref(0);
    const filters = ref([
      {
        id: '1d',
        period: '1d',
      },
      {
        id: '3d',
        period: '3d',
      },
      {
        id: '1w',
        period: '1w',
      },
      {
        id: '1M',
        period: '1m',
      },
      {
        id: 'all',
        period: 'All',
      },
    ]);
    const complexFilters = ref([
      {
        id: '1d',
        period: '1d',
      },
      {
        id: '3d',
        period: '3d',
      },
      {
        id: '1w',
        period: '1w',
      },
      {
        id: '1M',
        period: '1m',
      },
      {
        id: '3M',
        period: '3m',
      },
      {
        id: '6M',
        period: '6m',
      },
      {
        id: '1Y',
        period: '1y',
      },
      {
        id: 'all',
        period: 'All',
      },
    ]);

    onMounted(() => {
      changeChartPeriod();
    });
    function formatDate(date) {
      return format(date, 'dd MMM, yyyy');
    }
    function changeChartPeriod(period = '3d') {
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
                ? '350px'
                : '100%',
              offsetY: 70,
              zoom: {
                enabled: false,
              },
              fontFamily: "'Noto Sans', sans-serif",
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
              type: 'datetime',
              labels: {
                show: true,
                format: 'd MMM, yyyy',
                minHeight: 120,
                offsetY: 40,
                showDuplicates: false,
                style: {
                  fontSize: '12px',
                },
              },
              tooltip: {
                enabled: true,
                formatter: function (val) {
                  return formatDate(val);
                },
                marker: {
                  show: true,
                },
                offsetY: 155,
                style: {
                  fontSize: '12px',
                },
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: true,
                height: 0.5,
                color: '#E5E4E8',
                offsetY: 76,
              },
            },
            yaxis: {
              crosshairs: {
                show: true,
                width: 1,
                position: 'back',
                opacity: 0.9,
                stroke: {
                  color: '#b6b6b6',
                  width: 1,
                  dashArray: 3,
                },
              },
              labels: {
                show: false,
                style: {
                  fontSize: '12px',
                  fontFamily: "'Noto Sans', sans-serif",
                },
                formatter: function (value) {
                  return value.toFixed(2);
                },
              },
              tooltip: {
                enabled: false,
                marker: {
                  show: true,
                },
                style: {
                  fontSize: '12px',
                },
                offsetX: -10,
                offsetY: -55,
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
              marker: {
                show: true,
              },
              style: {
                fontFamily: 'noto-sans, Helvetica Neue, Arial, sans-serif',
              },
              x: {
                format: 'dd MMM, yyyy, HH:mm:ss',
              },
              y: {
                formatter: function (value) {
                  return parseFloat(value.toFixed(8));
                },
              },
              fixed: {
                enabled: true,
                position: 'topLeft',
                offsetX: 13,
                offsetY: -27,
              },
            },
            noData: {
              text: 'Loading...',
              align: 'center',
              verticalAlign: 'middle',
            },
            series: {},
          };
          options.series = res.series;
          options.xaxis.categories = res.options.xaxis.categories;
          let data = [...res.series[0].data];
          minValue.value = data.sort((a, b) => {
            return a - b;
          })[0];
          maxValue.value = data.sort((a, b) => {
            return b - a;
          })[0];
          minValue.value =
            'Low $' + formatAmount(minValue.value, false, 2, 2) + ' USD';
          maxValue.value =
            'High $' + formatAmount(maxValue.value, false, 2, 2) + ' USD';
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
      formatDate,
      minValue,
      maxValue,
      filters,
      complexFilters,
    };
  },
};
</script>

<style scoped>
.full-height .st-dashboard-chart {
  height: calc(100vh - 285px);
}
.st-dashboard-chart {
  height: 450px;
}
.chart-max,
.chart-min {
  position: absolute;
  left: 12px;
  font-family: var(--secondary-font);
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0.12px;
  color: var(--grey500);
}
.chart-max {
  top: 63px;
}
.chart-min {
  bottom: 100px;
}
:deep .apexcharts-tooltip,
:deep .apexcharts-tooltip.apexcharts-theme-light {
  min-width: 150px;
  flex-direction: column-reverse;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
:deep .apexcharts-tooltip .apexcharts-tooltip-title,
:deep .apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title {
  padding: 0;
  background: none;
  border: none;
  margin: 0;
}
:deep .apexcharts-tooltip-series-group {
  color: var(--marine500);
  padding: 3px 0 0;
  margin-bottom: 5px;
}
:deep .apexcharts-tooltip-marker {
  display: none;
}
:deep .apexcharts-svg text.apexcharts-xaxis-label,
:deep .apexcharts-svg text.apexcharts-yaxis-label {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
:deep .apexcharts-svg line.apexcharts-xaxis-tick {
  stroke-width: 4px;
  stroke-linecap: round;
}
:deep .apexcharts-svg text.apexcharts-xaxis-label::before {
  display: block;
  content: '';
  width: 4px;
  height: 4px;
  background: var(--grey50);
  border: 0 none;
  border-radius: 100%;
  margin: 0;
}
:deep .apexcharts-svg:hover text.apexcharts-xaxis-label,
:deep .apexcharts-svg:hover text.apexcharts-yaxis-label {
  opacity: 0.2;
}
:deep .apexcharts-xaxistooltip,
:deep .apexcharts-yaxistooltip {
  font-weight: 700;
  border: none;
  border-radius: 0;
  background-color: transparent;
  padding: 8px;
}
:deep .apexcharts-yaxistooltip {
  transform: translateY(70px);
}
:deep .apexcharts-xaxistooltip::before {
  display: block;
  content: '';
  width: 4px;
  height: 4px;
  background: var(--marine500);
  border: 0 none;
  border-radius: 100%;
  margin: 0;
  transform: translateX(-50%) translateY(-8px);
}
:deep .apexcharts-yaxistooltip::before {
  display: block;
  content: '';
  border: none;
  margin: 0;
}
:deep .apexcharts-xaxistooltip::after,
:deep .apexcharts-yaxistooltip::after {
  display: none;
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
