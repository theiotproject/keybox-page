import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./components/Layout/Layout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Error from "./pages/Error/Error.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Home from "./pages/Home/Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "signin/",
        element: <SignIn />,
      },
      {
        path: "signup/",
        element: <SignUp />,
      },
      {
        path: "dashboard/",
        element: <Dashboard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
