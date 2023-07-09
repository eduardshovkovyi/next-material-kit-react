import React, { createContext, useState, useRef, useEffect } from "react";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const timeoutId = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const showSuccess = (message = "Successfully created!") => {
    setMessage(message);
    setIsError(false);
    setOpenSnackbar(true);
    timeoutId.current = setTimeout(() => {
      setMessage("");
      setIsError(false);
      setOpenSnackbar(false);
    }, 2000);
  };

  const showError = (errorMessage) => {
    setMessage(errorMessage);
    setIsError(true);
    setOpenSnackbar(true);
    timeoutId.current = setTimeout(() => {
      setMessage("");
      setIsError(false);
      setOpenSnackbar(false);
    }, 2000);
  };

  return (
    <SnackbarContext.Provider
      value={{ openSnackbar, message, isError, showSuccess, showError }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};
