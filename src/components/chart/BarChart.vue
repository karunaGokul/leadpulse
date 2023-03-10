<template>
  <div class="chart__data" id="container"></div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import * as Highcharts from "highcharts/highstock";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";

NoDataToDisplay(Highcharts);

export default class BarChart extends Vue {
  @Prop() xAxis: Array<string>;
  @Prop() chartData: Array<number>;

  mounted() {
    this.bindChart();
  }

  @Watch("chartData", {})
  bindChart() {
    const chartData: Array<any> = [
      {
        data: this.chartData,
        color: "#2c7ed7",
      },
    ];

    Highcharts.chart("container", {
      chart: {
        type: "column",
      },
      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        categories: this.xAxis,
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: {
          text: "",
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return `
                            <div class="text--align-center pa--x-1">
                                <p>Leads: ${this.point.y}</p>
                            </div>
                        `;
        },
        backgroundColor: "#5F5F5F",
        borderColor: "#5F5F5F",
        borderRadius: 5,
        style: {
          color: "#fff",
        },
      },
      plotOptions: {
        column: {
          pointWidth: 40,
        },
      },
      series: chartData,
    });
  }
}
</script>