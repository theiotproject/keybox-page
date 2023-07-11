import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Copyright from "../components/Copyright";
import { Link as RouterLink } from "react-router-dom";
import LeftSide from "../components/LeftSide";
import LeftSideMobile from "../components/LeftSideMobile";
import { Google } from "@mui/icons-material"

export default function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <Box>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "column", xl: "row" },
          alignItems: "center",
        }}
      >
        <LeftSide />
        <LeftSideMobile />
        {/* the form */}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 1, md: 1, xl: 10 },
            width: { xs: 1, md: 1, xl: 1 / 2 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ alignContent: "flex-start" }}>
            <Typography component="h1" variant="h1">
              Hello!
            </Typography>
            <Typography component="h2" variant="h2">
              Sign up to get started
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="c-password"
                label="Confirm Password"
                type="c-password"
                id="c-password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ m:1, width: '30%' }}
            >
              Sign Up
            </Button>
            or
            <Button
              startIcon={<Google />}
              fullWidth
              variant="contained"
              sx={{ m:1,  width: '30%' }}
            > use Gmail
            </Button>
            </Box>
          <Grid container justifyContent="center">
            <Grid item sx={{ mb: 5 }}>
              <Link
                to={`/auth/SignIn`}
                variant="body2"
                component={RouterLink}
                underline="hover"
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Box>
  );
}
