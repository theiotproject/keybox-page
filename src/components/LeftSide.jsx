import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import bgimage from "../assets/bg.jpg";
import logo from "../assets/logo.png";

function LeftSide() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${bgimage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: { xs: 1, md: 1 / 2 },
        alignItems: "center",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      {/* <Box
        alignContent="center"
        component="img"
        sx={{ maxHeight: "0", maxWidth: "100%", mt: 5 }}
        alt="logo"
        src={logo}
      /> */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "cetner",
          alignItems: "center",
          maxHeight: "60vh",
          mt: 3,
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ maxHeight: "100%", width: "auto" }}
        />
      </Box>

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        sx={{ px: 5, flex: 1 }}
      >
        <Typography
          component="h3"
          variant="h3"
          alignContent="left"
          sx={{ fontSize: "2.5rem" }}
        >
          Key Box
        </Typography>
        <Typography
          variant="body2"
          alignContent="left"
          sx={{ fontSize: "1rem" }}
        >
          storing your keys has never been easier!
        </Typography>
        <Button
          type="button"
          width="30%"
          variant="contained"
          href={`/`}
          color="secondary"
          sx={{ mt: 3, borderRadius: 30, color: "white" }}
        >
          Visit our website
        </Button>
      </Grid>
    </Box>
  );
}

export default LeftSide;
