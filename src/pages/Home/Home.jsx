import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../backend/db";
import { useAuthState } from "react-firebase-hooks/auth";
import SignOutBtn from "../../components/SignOutBtn";
import ErrorMsg from "../../components/ErrorMsg";
import LoadingScreen from "../../components/LoadingScreen";

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
        <Typography variant="h2" component="h1" gutterBottom>
          Witaj <b>{user && auth.currentUser.email}</b> na stronie testowej
        </Typography>
        {!user ? (
          <>
            <Link to={`/signin`} variant="body2" component={RouterLink}>
              zaloguj się
            </Link>{" "}
            albo{" "}
            <Link to={`/signup`} variant="body2" component={RouterLink}>
              zarejestruj
            </Link>
            !
          </>
        ) : (
          <SignOutBtn />
        )}
      </Container>
    </Box>
  );
}

export default Home;
