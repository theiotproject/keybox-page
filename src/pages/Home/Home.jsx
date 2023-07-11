import { Link as RouterLink } from "react-router-dom";

import { Copyright } from "@mui/icons-material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import LeftSide from "src/components/LeftSide";
import LeftSideMobile from "src/components/LeftSideMobile";
import SignOutBtn from "src/components/SignOutBtn";

import { auth } from "src/backend/db";
import { useAuthProvider } from "src/contexts/AuthContext";

function Home() {
  const { currentUser } = useAuthProvider();

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
            {currentUser && auth.currentUser.displayName} Welcome to Key Box
          </Typography>
          {!currentUser ? (
            <Typography variant="h2">
              <Link
                to={`/signin`}
                variant="body2"
                component={RouterLink}
                underline="hover"
              >
                Sign In
              </Link>{" "}
              or{" "}
              <Link
                to={`/signup`}
                variant="body2"
                component={RouterLink}
                underline="hover"
              >
                Sign Up
              </Link>
              !
            </Typography>
          ) : (
            <SignOutBtn />
          )}
        </Box>
      </Box>
      <Copyright />
    </Box>
  );
}

export default Home;
