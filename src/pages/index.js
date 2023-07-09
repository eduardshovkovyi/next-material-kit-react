import Head from "next/head";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { BoxesBlock } from "src/sections/overview/boxes-block";
import { useDataContext } from "src/providers/docs-provider";
import LoadingComponent from "src/components/loader";

const Page = () => {
  const { data, isLoading } = useDataContext();
  console.log("isLoading", isLoading);
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <>
      <Head>
        <title>Overview</title>
      </Head>
      {data?.tableData?.length ? (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Grid container spacing={3} mb={3}>
              <BoxesBlock />
            </Grid>
            <Grid xs={12} mb={4}>
              <OverviewLatestOrders />
            </Grid>
            <Grid xs={12} lg={8} mb={4}>
              <OverviewSales />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic />
            </Grid>
          </Container>
        </Box>
      ) : (
        <Box
          sx={{
            p: 5,
          }}
        >
          Not data available
        </Box>
      )}
    </>
  );
};

Page.getLayout = (page, isDarkMode, setDarkMode) => (
  <DashboardLayout isDarkMode={isDarkMode} setDarkMode={setDarkMode}>
    {page}
  </DashboardLayout>
);

export default Page;
