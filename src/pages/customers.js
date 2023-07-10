import { Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDataContext } from "src/providers/docs-provider";

const Page = () => {
  const { data } = useDataContext();

  return (
    <Box
      sx={{
        p: 5,
      }}
    >
      {data?.iframeLinks?.iframeLink1 ? (
        <iframe
          src={data?.iframeLinks?.iframeLink1}
          title="rosh"
          width="100%"
          height="1144"
          scrolling="no"
          frameBorder="0"
          allowFullScreen="allowfullscreen"
        ></iframe>
      ) : (
        "Not data available"
      )}
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
