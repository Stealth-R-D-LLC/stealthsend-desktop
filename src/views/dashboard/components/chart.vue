<template>
  <div class="st-dashboard-chart"></div>
</template>

<script>
import ApexCharts from 'apexcharts';
import { onMounted } from '@vue/runtime-core';
import useHelpers from '@/composables/useHelpers';
import { useMainStore } from '@/store';

export default {
  name: 'StDashboardChart',
  setup() {
    const { formatAmount } = useHelpers();
    const mainStore = useMainStore();

    onMounted(() => {
      mainStore.getChartData().then((res) => {
        var options = {
          chart: {
            type: 'area',
            toolbar: {
              show: false,
            },
            width: '100%',
            offsetX: -5,
            zoom: {
              enabled: false,
            },
            selection: {
              enabled: false,
            },
          },
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
            labels: {
              showDuplicates: false,
              show: false,
              formatter: function (value) {
                let itemDate = new Date(value);
                return itemDate.toLocaleDateString();
              },
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          yaxis: {
            forceNiceScale: true,
            labels: {
              show: false,
              formatter: function (value) {
                return formatAmount(value, false, 4);
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
            marker: {
              show: true,
            },
            style: {
              fontFamily: 'noto-sans, Helvetica Neue, Arial, sans-serif',
            },
            y: {
              formatter: function (value) {
                return parseFloat(value.toFixed(17));
              },
            },
          },
          noData: {
            text: 'Loading...',
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
      });
    });
    return {};
  },
};
</script>
