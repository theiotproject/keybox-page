import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { CircularProgress } from "@mui/material";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./backend/db";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard/Dashboard";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Unverified from "./pages/Unverified/Unverified";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <>
      <AuthProvider value={{ currentUser }}>
        <BrowserRouter>
          <Routes>
            <Route
              element={<Layout />}
              errorElement={<Error />}
              loader={<CircularProgress />}
            >
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    isSignedIn={currentUser}
                    isEmailVerified={currentUser?.emailVerified}
                  >
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/unverified" element={<Unverified />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
