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
      <CardHeader title="סטטוס חשבוניות" style={{ textAlign: "right" }} />
      {data?.tableData?.length ? (
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
      ) : (
        ""
      )}
    </Card>
  );
};
