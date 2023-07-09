import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import HomeIcon from "@heroicons/react/24/solid/HomeIcon";

import TableCellsIcon from "@heroicons/react/24/solid/TableCellsIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "ראשי",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    ),
  },
  {
    title: "שוטף + תבר",
    path: "/customers",
    icon: (
      <SvgIcon fontSize="small">
        <TableCellsIcon />
      </SvgIcon>
    ),
  },
  {
    title: "פיננסים",
    path: "/companies",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "אבטחת מידע",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
];
