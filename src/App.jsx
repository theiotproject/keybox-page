import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CircularProgress, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import LayoutSignedIn from "./components/Layout/LayoutSignedIn";
import Layout from "src/components/Layout/Layout";
import ProtectedRoute from "src/components/ProtectedRoute";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "src/backend/db_config";
import { AuthProvider } from "src/contexts/AuthContext";
import Dashboard from "src/pages/Dashboard/Dashboard";
import Error from "src/pages/Error/Error";
import Home from "src/pages/Home/Home";
import SignIn from "src/pages/SignIn/SignIn";
import SignUp from "src/pages/SignUp/SignUp";
import Unverified from "src/pages/Unverified/Unverified";

import theme from "./theme";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(undefined);
      }

      setCurrentUser(user);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            </Route>
            <Route
              element={<LayoutSignedIn />}
              errorElement={<Error />}
              loader={<CircularProgress />}
            >
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
    </ThemeProvider>
  );
}

export default App;
