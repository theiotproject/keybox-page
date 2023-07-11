import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import bgimage from "../assets/bg.jpg";
import logo from "../assets/logo.png";

function LeftSideMobile() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${bgimage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: { xs: 1, md: 1, xl: 1 / 2 },
        height: "11rem",
        alignItems: "center",
        justifyContent: "center",
        display: { xs: "flex", md: "flex", xl: "none" },
        flexDirection: "column",
      }}
    >
      <Box
        component="img"
        sx={{ height: "7rem", width: "7rem", mt: 1 }}
        alt="logo"
        src={logo}
      />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body2" alignContent="left">
          storing your keys has never been easier!
        </Typography>
      </Grid>
    </Box>
  );
}

export default LeftSideMobile;
