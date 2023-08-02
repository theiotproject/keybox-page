import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CircularProgress, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import LayoutSignedIn from "./components/Layout/LayoutSignedIn";
import showInfo from "./components/Toasts/ToastInfo";
import Layout from "src/components/Layout/Layout";
import ProtectedRoute from "src/components/ProtectedRoute";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "src/backend/db_config";
import { AuthProvider } from "src/contexts/AuthContext";
import Cards from "src/pages/Cards/Cards";
import Dashboard from "src/pages/Dashboard/Dashboard";
import Error from "src/pages/Error/Error";
import Home from "src/pages/Home/Home";
import Keyboxes from "src/pages/Keyboxes/Keyboxes";
import NotFound from "src/pages/NotFound/NotFound";
import ChangePassword from "src/pages/Profile/ProfileChangePassword";
import ProfileChangePassword from "src/pages/Profile/ProfileChangePassword";
import SignIn from "src/pages/SignIn/SignIn";
import SignInChangePassword from "src/pages/SignIn/signInChangePassword";
import SignOut from "src/pages/SignOut";
import SignUp from "src/pages/SignUp/SignUp";
import Unverified from "src/pages/Unverified/Unverified";
import Profile from "src/pages/profile/Profile";
import theme from "src/theme";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(undefined);
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider value={{ currentUser }}>
        <BrowserRouter>
          <Routes>
            {/* Singed out routes */}
            <Route
              element={<Layout />}
              errorElement={<Error />}
              loader={<CircularProgress />}
            >
              <Route path="*" element={<NotFound />} />
              <Route path="signout" element={<SignOut />} />
              <Route path="" element={<Home />} />
              <Route path="signin" element={<SignIn />} />
              <Route
                path="signin/changepassword"
                element={<SignInChangePassword />}
              />
              <Route path="signup" element={<SignUp />} />
            </Route>
            {/* Singed in routes */}
            <Route
              element={<LayoutSignedIn />}
              errorElement={<Error />}
              loader={<CircularProgress />}
            >
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute
                    isSignedIn={currentUser}
                    isEmailVerified={currentUser?.emailVerified}
                  >
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="profile"
                element={
                  <ProtectedRoute
                    isSignedIn={currentUser}
                    isEmailVerified={currentUser?.emailVerified}
                  >
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile/changepassword"
                element={
                  <ProtectedRoute
                    isSignedIn={currentUser}
                    isEmailVerified={currentUser?.emailVerified}
                  >
                    <ProfileChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="keyboxes"
                element={
                  <ProtectedRoute
                    isSignedIn={currentUser}
                    isEmailVerified={currentUser?.emailVerified}
                  >
                    <Keyboxes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="changepassword"
                element={
                  <ProtectedRoute
                    isSignedIn={currentUser}
                    isEmailVerified={currentUser?.emailVerified}
                  >
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cards"
                element={
                  <ProtectedRoute
                    isSignedIn={currentUser}
                    isEmailVerified={currentUser?.emailVerified}
                  >
                    <Cards />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="unverified" element={<Unverified />} />
          </Routes>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
