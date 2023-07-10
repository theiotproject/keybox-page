import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Copyright from "./components/Copyright";
import { Link as RouterLink } from "react-router-dom";
import LeftSide from "./components/LeftSide";
import { Container, CssBaseline } from "@mui/material";
import LeftSideMobile from "./components/LeftSideMobile";

function App() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "column", xl: "row" },
          alignItems: "center",
        }}
      >
        <CssBaseline />
        <LeftSide />
        <LeftSideMobile />
        <Box
          sx={{
            p: { xs: 1, md: 1, xl: 10 },
            width: { xs: 1, md: 1, xl: 1 / 2 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography gutterBottom variant="h1">
            Welcome to Key Box
          </Typography>
          <Typography variant="h2">
            <Link to={`/auth/SignUp`} component={RouterLink} underline="hover">
              Sign Up
            </Link>{" "}
            or{" "}
            <Link to={`/auth/SignUp`} component={RouterLink} underline="hover">
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
      <Copyright />
    </Box>
  );
}

export default App;
