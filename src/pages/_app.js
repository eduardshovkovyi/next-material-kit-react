import { useEffect, useState } from "react";
import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { AuthConsumer, AuthProvider } from "src/contexts/auth-context";
import { useNProgress } from "src/hooks/use-nprogress";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import { DocxProvider } from "src/providers/docs-provider";
import { SnackbarProvider } from "src/contexts/snackbar-context";

import "simplebar-react/dist/simplebar.min.css";

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(window.localStorage.getItem("isDarkMode") === "true" || false);
  }, []);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme(isDarkMode);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My app</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns} dir="rtl">
        <AuthProvider>
          <SnackbarProvider>
            <DocxProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthConsumer>
                  {(auth) =>
                    auth.isLoading ? (
                      <SplashScreen />
                    ) : (
                      getLayout(
                        <Component {...pageProps} />,
                        isDarkMode,
                        setDarkMode
                      )
                    )
                  }
                </AuthConsumer>
              </ThemeProvider>
            </DocxProvider>
          </SnackbarProvider>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
