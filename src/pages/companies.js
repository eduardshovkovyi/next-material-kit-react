import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useDataContext } from "../providers/docs-provider";

const Page = () => {
  const { data } = useDataContext();

  return (
    <div>
      <iframe
        src={data?.iframeLinks?.iframeLink2}
        title="rosh"
        width="100%"
        height="1144"
        scrolling="no"
        frameBorder="0"
        allowFullScreen="allowfullscreen"
      ></iframe>
    </div>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
