import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Poppins"].join(","),
    h1: {
      color: "#333",
      fontSize: "2rem",
      fontFamily: "Poppins",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "normal",
      margin: 1,
    },

    h2: {
      color: "#333",
      fontSize: "1.5rem",
      fontFamily: "Poppins",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "normal",
      padding: 3,
    },

    h3: {
      color: "#FFF",
      fontSize: "1rem",
      fontFamily: "Poppins",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "normal",
      margin: 2,
    },
    body2: {
      color: "#FFF",
      fontSize: "0.7rem",
      fontFamily: "Poppins",
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
              backgroundColor: "#00618A",
              color: "#fff",
            }),
        }),
      },
    },
  },
  palette: {
    primary: {
      main: "#00618A",
      light: "#3280a1",
      dark: "#003a52",
      contrastText: "white",
    },
    secondary: {
      main: "#E56C00",
      light: "#FF9332",
      dark: "#994800",
      contrastText: "black",
      contrastTextVariant: "#5A5A5F"
    },

  },
});

export default theme;
