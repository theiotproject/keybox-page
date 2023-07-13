import { Outlet } from "react-router-dom";

import MiniDrawer from "./components/SideDrawer";
import Footer from "src/components/Layout/components/Footer";
import Header from "src/components/Layout/components/Header";

function Layout() {
  return (
    <>
      <MiniDrawer />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
