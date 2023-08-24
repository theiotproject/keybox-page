import { Outlet } from "react-router-dom";

import Footer from "src/components/Layout/components/Footer";

function Layout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
