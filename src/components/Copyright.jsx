import { Link } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Copyright(props) {
  return (
    <Box
      fullWidth
      sx={{
        backgroundColor: "primary.main",
        alignItems: "center",
        p: 2,
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2" color="white" align="center" {...props}>
        {"Copyright © "}
        <Link color="inherit" href="https://theiotproject.com/">
          IoT Project
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
}

export default Copyright;
