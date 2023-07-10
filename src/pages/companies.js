import { Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDataContext } from "src/providers/docs-provider";
import LoadingComponent from "src/components/loader";

const Page = () => {
  const { data } = useDataContext();

  if (!data?.iframeLinks?.iframeLink2) {
    return <LoadingComponent />;
  }

  return (
    <Box
      sx={{
        p: 5,
      }}
    >
      {data?.iframeLinks?.iframeLink2 ? (
        <iframe
          src={data?.iframeLinks?.iframeLink2}
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

Page.getLayout = (page, isDarkMode, setDarkMode) => (
  <DashboardLayout isDarkMode={isDarkMode} setDarkMode={setDarkMode}>
    {page}
  </DashboardLayout>
);

export default Page;
