import { Box, Card, CardContent, useTheme } from "@mui/material";

import { Chart } from "src/components/chart";
import { useDataContext } from "src/providers/docs-provider";
import { checkAllZeros, removeFirstElementsAndFormat } from "./config";

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
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
    legend: {
      show: true,
      position: "top",
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Your Y Axis Label",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Your X Axis Label",
          },
        },
      ],
    },
  };
};

export const OverviewTraffic = (props) => {
  const { data } = useDataContext();
  const tableData = data?.tableData?.length && data?.tableData;

  const chartOptions = useChartOptions();
  let newChartOptions = [];
  let newTableData = [];

  if (tableData?.length) {
    newChartOptions = {
      ...chartOptions,
      labels: tableData[0].slice(1),
    };
    newTableData = removeFirstElementsAndFormat(tableData);
  }

  return tableData?.length ? (
    <Card>
      <CardContent
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {newTableData.map((item, index) => {
          if (!checkAllZeros(item)) {
            return (
              <Box mb={4} key={index}>
                <Chart
                  height={300}
                  options={{
                    ...newChartOptions,
                    title: {
                      text: tableData.slice(1)[index][0],
                      align: "center",
                    },
                  }}
                  series={item}
                  type="donut"
                  width={400}
                />
              </Box>
            );
          }
        })}
      </CardContent>
    </Card>
  ) : null;
};
