import { useAuthState } from "react-firebase-hooks/auth";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ErrorMsg from "components/ErrorMsg";
import LoadingScreen from "components/LoadingScreen";

import { auth } from "backend/db";
import SignOutBtn from "components/SignOutBtn";

function Home() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    <ErrorMsg errorCode={error.code} errorMessage={error.message} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Reset default global css styles and set up MUI dark mode */}
      <CssBaseline enableColorScheme />
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            Witaj <b>{user && auth.currentUser.displayName}</b> na stronie
            testowej
          </Typography>

          {user && (
            <img
              src={`${auth.currentUser.photoURL}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${auth.currentUser.photoURL}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={`${auth.currentUser.displayName}'s pfp`}
              height={300}
              width={300}
              loading="lazy"
            />
          )}

          {!user ? (
            <Box>
              <Link to={`/signin`} variant="body2" component={RouterLink}>
                zaloguj się
              </Link>{" "}
              albo{" "}
              <Link to={`/signup`} variant="body2" component={RouterLink}>
                zarejestruj
              </Link>
              !
            </Box>
          ) : (
            <SignOutBtn />
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
