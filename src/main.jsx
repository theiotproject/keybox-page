import React from "react";
import ReactDOM from "react-dom/client";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import App from "./App.jsx";

const theme = createTheme({
  typography: {
    fontFamily: ["Geometria", "Poppins"].join(","),
    h1: {
      color: "#333",
      fontSize: 70,
      fontFamily: "Poppins",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "normal",
      margin: 1,
    },

    h2: {
      color: "#333",
      fontSize: 30,
      fontFamily: "Geometria",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "normal",
      padding: 3,
    },

    h3: {
      color: "#FFF",
      fontSize: 50,
      fontFamily: "Poppins",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "normal",
      margin: 2,
    },
    body2: {
      color: "#FFF",
      fontSize: 20,
      fontFamily: "Geometria",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "normal",
      margin: 2,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "contained" &&
            ownerState.color === "primary" && {
              backgroundColor: "#3AA090",
              borderRadius: 30,
              color: "#fff",
            }),
        }),
      },
    },
  },
  palette: {
    primary: {
      main: "#3AA090",
      light: "#61b3a6",
      dark: "#226056",
      contrastText: "white",
    },
    secondary: {
      main: "#FF7900",
      light: "#FF9332",
      dark: "#994800",
      contrastText: "black",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
