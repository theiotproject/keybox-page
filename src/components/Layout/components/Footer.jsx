import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Copyright from "../../Copyright";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">Footer</Typography>
        <Copyright />
      </Container>
    </Box>
  );
}

export default Footer;
