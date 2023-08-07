import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import LeftSide from "src/components/LeftSide";
import LeftSideMobile from "src/components/LeftSideMobile";
import SignOutBtn from "src/components/SignOutBtn";

import { useAuthProvider } from "src/contexts/AuthContext";
import useKeyboxData from "src/util/services/useKeyboxData";

function Home() {
  const { currentUser } = useAuthProvider();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
        }}
      >
        <LeftSide />
        <LeftSideMobile />
        <Box
          sx={{
            p: { xs: 5, md: 10 },
            width: { xs: 1, md: 1 / 2 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Typography
            gutterBottom
            variant="h1"
            sx={{ fontSize: { xs: 30, md: 50 } }}
          >
            {currentUser?.displayName} <br /> Welcome to Key Box
          </Typography>
          {!currentUser ? (
            <Typography variant="h2">
              <Link to={`/signin`} component={RouterLink} underline="hover">
                Sign In
              </Link>{" "}
              or{" "}
              <Link to={`/signup`} component={RouterLink} underline="hover">
                Sign Up
              </Link>
              !
            </Typography>
          ) : (
            <SignOutBtn />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
