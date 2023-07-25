import { Outlet } from "react-router-dom";

import { Container } from "@mui/material";

import Header from "../../components/Layout/components/Header";
import MiniDrawer from "./components/SideDrawer";
import Footer from "src/components/Layout/components/Footer";

function Layout() {
  return (
    <>
      <Header />
      <MiniDrawer />
      <Container
        maxWidth="xl"
        sx={{ pl: { xs: "64px", sm: "88px" }, pr: { xs: "0px", sm: "24px" } }}
        disableGutters={true}
      >
        <main>
          <Outlet />
        </main>
      </Container>

      <Footer />
    </>
  );
}

export default Layout;
