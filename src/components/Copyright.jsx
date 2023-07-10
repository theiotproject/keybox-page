import { Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Copyright(props) {
  return (
    <Box fullWidth sx={{backgroundColor: 'primary.main', height: '7vh', alignItems: "center", p:2, position: 'sticky', bottom: 0, width: '100%',}}>
    <Typography
      variant="body2"
      color="white"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        IoT Project
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
    </Box>
  );
}

export default Copyright;
