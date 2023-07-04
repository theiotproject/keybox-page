import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

function MainPage() {
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
          Witaj na stronie testowej
        </Typography>
        <Link to={`/signin`} variant="body2" component={RouterLink}>
          zaloguj się
        </Link>{" "}
        albo{" "}
        <Link to={`/signup`} variant="body2" component={RouterLink}>
          zarejestruj
        </Link>
        !
      </Container>
    </Box>
  );
}

export default MainPage;
