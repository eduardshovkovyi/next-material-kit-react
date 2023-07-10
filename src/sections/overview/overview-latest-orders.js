import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { Scrollbar } from "src/components/scrollbar";
import { useDataContext } from "src/providers/docs-provider";

export const OverviewLatestOrders = () => {
  const { data } = useDataContext();

  return (
    <Card>
      {data?.tableData?.length ? (
        <>
          <CardHeader title="סטטוס חשבוניות" style={{ textAlign: "right" }} />
          <Scrollbar sx={{ flexGrow: 1 }}>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {data.tableData[0].map((item, index) => (
                      <TableCell key={index}>{item}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.tableData.slice(1).map((row, index) => (
                    <TableRow hover key={index}>
                      {row.map((item, index) => (
                        <TableCell key={index}>{item}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
        </>
      ) : null}
    </Card>
  );
};
