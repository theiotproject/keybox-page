import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
const defaultTheme = createTheme();

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <main style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
