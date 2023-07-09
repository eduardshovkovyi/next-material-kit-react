import { common } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { error, indigo, info, neutral, success, warning } from "./colors";

export function createPalette(isDarkMode = false) {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12),
    },
    background: {
      default: !isDarkMode ? common.white : neutral[900],
      paper: !isDarkMode ? common.white : neutral[900],
    },
    divider: !isDarkMode ? "#F2F4F7" : neutral[700],
    error,
    info,
    mode: !isDarkMode ? "light" : "dark",
    neutral,
    primary: indigo,
    success,
    text: {
      primary: !isDarkMode ? neutral[900] : common.white,
      secondary: !isDarkMode ? neutral[500] : alpha(common.white, 0.7),
      disabled: !isDarkMode
        ? alpha(neutral[900], 0.38)
        : alpha(common.white, 0.38),
    },
    warning,
  };
}
