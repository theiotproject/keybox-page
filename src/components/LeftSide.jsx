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
        width: { xs: 1, md: 1, xl: 1 / 2 },
        height: "100vh",
        alignItems: "center",
        display: { xs: "none", md: "none", xl: "flex" },
        flexDirection: "column",
      }}
    >
      <Box
        alignContent="center"
        component="img"
        sx={{ height: "30rem", width: "30rem", mt: 5 }}
        alt="logo"
        src={logo}
      />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        sx={{ p: 5 }}
      >
        <Typography component="h3" variant="h3" alignContent="left">
          Key Box
        </Typography>
        <Typography component="body2" variant="body2" alignContent="left">
          storing your keys has never been easier!
        </Typography>
        <Button
          type="button"
          width="30%"
          variant="contained"
          href={`/`}
          sx={{ mt: 3, mb: 2, borderRadius: 30, backgroundColor: "#3AA090" }}
        >
          Visit our website
        </Button>
      </Grid>
    </Box>
  );
}

export default LeftSide;
