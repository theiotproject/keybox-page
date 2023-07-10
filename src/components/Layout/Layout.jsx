import { Outlet } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import Footer from "src/components/Layout/components/Footer";

const defaultTheme = createTheme();

function Layout() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <main style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default Layout;
