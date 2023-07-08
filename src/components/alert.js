import React from "react";
import Alert from "@mui/material/Alert";

function ErrorComponent({ message }) {
  return <Alert severity="error">{message}</Alert>;
}

export default ErrorComponent;
