import { Outlet } from "react-router-dom";

import { Container } from "@mui/material";

import Header from "../../components/Layout/components/Header";
import MiniDrawer from "./components/SideDrawer";
import Footer from "src/components/Layout/components/Footer";

function Layout() {
  return (
    <div style={{ backgroundColor: "#F2F2F8" }}>
      <Header />
      <MiniDrawer />
      <Container
        maxWidth="xl"
        sx={{
          pl: { xs: "64px", sm: "88px" },
          pr: { xs: "0px", sm: "24px" },
          pb: "1em",
          minHeight: "80dvh",
        }}
        disableGutters={true}
      >
        <main>
          <Outlet />
        </main>
      </Container>

      <Footer />
    </div>
  );
}

export default Layout;
