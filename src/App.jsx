import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CircularProgress } from "@mui/material";

import Layout from "src/components/Layout/Layout";
import ProtectedRoute from "src/components/ProtectedRoute";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "src/backend/db";
import { AuthProvider } from "src/contexts/AuthContext";
import Dashboard from "src/pages/Dashboard/Dashboard";
import Error from "src/pages/Error/Error";
import Home from "src/pages/Home/Home";
import SignIn from "src/pages/SignIn/SignIn";
import SignUp from "src/pages/SignUp/SignUp";
import Unverified from "src/pages/Unverified/Unverified";

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
