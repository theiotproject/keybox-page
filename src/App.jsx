import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Footer from "./components/Footer";
import { Link as RouterLink } from "react-router-dom";


function App() {
  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <CssBaseline />
        <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
          <Typography gutterBottom variant='h1'>
            Witaj na stronie testowej
          </Typography>
          
          <Link to={`/auth/SignUp`} component={RouterLink} variant="body2">
            zaloguj się
          </Link>{" "}
          albo{" "}
          <Link to={`/auth/SignUp`} component={RouterLink} variant="body2">
            zarejestruj
          </Link>
          !
        </Container>
        <Footer />
      </Box>
  );
}

export default App;
