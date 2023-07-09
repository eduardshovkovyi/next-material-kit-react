import PropTypes from "prop-types";
import { Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chart } from "src/components/chart";
import { useDataContext } from "src/providers/docs-provider";
import { formatData, getCategories } from "./config";

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      floating: false,
      offsetY: 0,
      labels: {
        colors: theme.palette.text.primary,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 20,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "40px",
      },
    },
    stroke: {
      colors: ["transparent"],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};

export const OverviewSales = () => {
  const { data } = useDataContext();
  const tableData = data?.tableData?.length && data?.tableData;

  const chartOptions = useChartOptions();
  let newChartOptions = [];
  let newTableData = [];
  const legendNames = ["Name1", "Name2", "Name3", "Name4", "Name5"];

  if (tableData?.length) {
    newChartOptions = {
      ...chartOptions,
      xaxis: { ...chartOptions.xaxis, categories: getCategories(tableData) },
    };
    newTableData = formatData(tableData);
  }

  return tableData?.length ? (
    <Card>
      <CardContent>
        <Chart
          height={350}
          options={newChartOptions}
          series={newTableData}
          type="bar"
          width="100%"
        />
      </CardContent>
    </Card>
  ) : null;
};
