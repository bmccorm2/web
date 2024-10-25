<script lang="ts">
  import {
    Chart,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from "chart.js";

  Chart.register(
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  );

  interface yieldItem {
    effectiveDate: string;
    oneMonth: number;
    twoMonth: number;
    threeMonth: number;
    sixMonth: number;
    oneYear: number;
    twoYear: number;
    threeYear: number;
    fiveYear: number;
    sevenYear: number;
    tenYear: number;
    twentyYear: number;
    thirtyYear: number;
  }

  interface Props {
    chartData: [yieldItem];
  }

  let { chartData }: Props = $props();
  let ctx: any;
  const backgroundColor = ["green", "blue", "red"];
  const borderColor = ["mediumseagreen", "mediumblue", "mediumvioletred"];
  const radius = [10, 5, 5];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  const data: any = {
    labels: [
      "1MO",
      "3MO",
      "6MO",
      "1YR",
      "2YR",
      "3YR",
      "5YR",
      "7YR",
      "10YR",
      "20YR",
      "30YR",
    ],
    datasets: chartData?.map((e: yieldItem, index: number) => {
      return {
        label: new Date(e.effectiveDate).toISOString().split("T")[0],
        data: [
          e.oneMonth,
          e.threeMonth,
          e.sixMonth,
          e.oneYear,
          e.twoYear,
          e.threeYear,
          e.fiveYear,
          e.sevenYear,
          e.tenYear,
          e.twentyYear,
          e.thirtyYear,
        ],
        backgroundColor: backgroundColor[index],
        borderColor: borderColor[index],
        fill: false,
        radius: radius[index],
      };
    }),
  };
</script>
