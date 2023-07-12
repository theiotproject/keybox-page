import { Outlet } from "react-router-dom";

import Footer from "src/components/Layout/components/Footer";
import MiniDrawer from "./components/SideDrawer";

function Layout() {
  return (
    <>
      <main>
        <MiniDrawer />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
