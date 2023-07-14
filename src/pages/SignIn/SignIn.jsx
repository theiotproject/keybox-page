import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Google } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ErrorMsg from "src/components/ErrorMsg";
import LeftSide from "src/components/LeftSide";
import LeftSideMobile from "src/components/LeftSideMobile";
import LoadingScreen from "src/components/LoadingScreen";

import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();

  const { currentUser } = useAuthProvider();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);

  const handleSignInOnSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    signInWithEmailAndPassword(data.get("email"), data.get("password"));
  };

  if (loading || loadingGoogle) {
    return <LoadingScreen />;
  }

  if (error || errorGoogle) {
    return (
      <ErrorMsg errorMessage="Wystąpił nieznany błąd z bazą danych, sprawdź konsolę po więcej informacji" />
    );
  }

  if (currentUser || user || userGoogle) {
    navigate("/dashboard");
  }

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
        {/* the form */}
        <Box
          component="form"
          noValidate
          onSubmit={handleSignInOnSubmit}
          sx={{
            p: { xs: 3, md: 10 },
            width: { xs: 1, md: 1 / 2 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ alignContent: "flex-start" }}>
            <Typography component="h1" variant="h1">
              Hello Again!
            </Typography>
            <Typography component="h2" variant="h2">
              Sign in
            </Typography>
          </Box>
          <Grid sx={{ mt: 5 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Grid container>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ m: 1, width: "30%" }}
              >
                Sign In
              </Button>
              or
              <Button
                startIcon={<Google />}
                fullWidth
                variant="contained"
                sx={{ m: 1, width: "30%", p: 1 }}
                onClick={() => signInWithGoogle()}
              >
                {" "}
                use Google
              </Button>
            </Box>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" underline="hover">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item sx={{ mb: 5 }}>
                <Link
                  to={`/signup`}
                  variant="body2"
                  component={RouterLink}
                  underline="hover"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
