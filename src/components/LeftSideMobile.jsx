import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import bgimage from "src/assets/bg.jpg";
import logo from "src/assets/logo.png";

function LeftSideMobile() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${bgimage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        width: { xs: 1, md: 1 / 2 },
        height: "11rem",
        alignItems: "center",
        justifyContent: "center",
        display: { xs: "flex", md: "none" },
        flexDirection: "column",
      }}
    >
      <Box
        component="img"
        sx={{ maxHeight: "6rem", width: "auto", mt: 1 }}
        alt="logo"
        src={logo}
      />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body2" alignContent="left" sx={{ m: 2 }}>
          storing your keys has never been easier!
        </Typography>
      </Grid>
    </Box>
  );
}

export default LeftSideMobile;
