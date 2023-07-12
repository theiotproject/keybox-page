import { Outlet } from "react-router-dom";

import MiniDrawer from "./components/SideDrawer";
import Footer from "src/components/Layout/components/Footer";

function Layout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
