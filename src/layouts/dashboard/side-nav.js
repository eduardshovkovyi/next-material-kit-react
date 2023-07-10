import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PropTypes from "prop-types";
import MoonIcon from "@heroicons/react/24/solid/MoonIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/solid/ArrowLeftOnRectangleIcon";

import {
  Box,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import { useDataContext } from "src/providers/docs-provider";
import { useCallback } from "react";
import { useAuth } from "../../hooks/use-auth";

export const SideNav = (props) => {
  const { open, onClose, isDarkMode, setDarkMode } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const { data } = useDataContext();
  const router = useRouter();
  const auth = useAuth();

  const handleDarkMode = () => {
    window.localStorage.setItem("isDarkMode", !isDarkMode);
    setDarkMode((prev) => !prev);
  };

  const handleSignOut = useCallback(() => {
    auth.signOut();
  }, [auth, router]);

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: "inline-flex",
              height: 32,
              width: 32,
            }}
          >
            <Logo />
          </Box>
        </Box>
        <Box
          mt={2}
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              if (data?.isAdmin === false && item.path === "/account") {
                return null;
              }

              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          sx={{
            pl: 3,
            pt: 3,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleSignOut}
        >
          <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
            <ArrowLeftOnRectangleIcon />
          </SvgIcon>
          <Typography sx={{ color: "neutral.400", ml: 2 }}>התנתקות</Typography>
        </Box>
        <Box sx={{ p: 3, pt: 2, display: "flex", alignItems: "center" }}>
          <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
            <MoonIcon />
          </SvgIcon>
          <Typography sx={{ color: "neutral.400", mr: 2, ml: 2 }}>
            מצב לילה
          </Typography>
          <Switch
            checked={isDarkMode}
            onChange={handleDarkMode}
            name="darkModeToggle"
          />
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
            left: "auto",
            right: 0,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
          left: "auto",
          right: 0,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
