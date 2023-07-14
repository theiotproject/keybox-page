import { Outlet } from "react-router-dom";

import Header from "../../components/Layout/components/Header";
import MiniDrawer from "./components/SideDrawer";
import Footer from "src/components/Layout/components/Footer";

function Layout() {
  return (
    <>
      <Header />
      <MiniDrawer />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
