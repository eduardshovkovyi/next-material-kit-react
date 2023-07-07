import React from "react";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";

import { useDataContext } from "src/providers/docs-provider";
import { convertBoxesData } from "./config";

export const BoxesBlock = () => {
  const { data } = useDataContext();
  let boxesData = convertBoxesData(data?.boxesData);

  return boxesData?.length
    ? boxesData.map((item) => (
        <Grid xs={12} sm={6} lg={4} key={item[1]}>
          <Card>
            <CardContent>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Stack spacing={1}>
                  <Typography color="text.secondary" variant="overline">
                    {item[0]}
                  </Typography>
                  <Typography variant="h4">{item[1]}</Typography>
                </Stack>
                <Avatar
                  sx={{
                    backgroundColor: "error.main",
                    height: 56,
                    width: 56,
                  }}
                >
                  <SvgIcon>
                    <CurrencyDollarIcon />
                  </SvgIcon>
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))
    : "";
};
