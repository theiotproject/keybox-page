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

import { GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();

  const { currentUser } = useAuthProvider();

  const setUserDocumentInFirestore = async (user) => {
    // create user document in users collection
    await setDoc(doc(db, "users", user.uid), {
      // user inital data
      groups: [],
      test: false,
    }).catch((error) => {
      showError(
        "Error while handling users database structure, check console for more info"
      );
      console.error(error);
    });
  };

  const signInWithGoogle = async () => {
    const signInWithGoogle = new GoogleAuthProvider();

    signInWithGoogle.setCustomParameters({ prompt: "select_account" });
    signInWithPopup(auth, signInWithGoogle)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        const { isNewUser } = getAdditionalUserInfo(result);
        if (isNewUser) {
          setUserDocumentInFirestore(user);
        }
      })

      .catch((error) => {
        showError(
          "Error while creating user using Google Provider, check console for more info"
        );
        console.error(error);
      });
  };

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const handleSignInOnSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    signInWithEmailAndPassword(data.get("email"), data.get("password"));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorMsg errorMessage="Wystąpił nieznany błąd z bazą danych, sprawdź konsolę po więcej informacji" />
    );
  }

  if (currentUser || user) {
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
            px: { xs: 3, md: 10 },
            width: { xs: 1, md: 1 / 2 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ alignContent: "flex-start", mb: 3 }}>
            <Typography component="h1" variant="h1">
              Hello Again!
            </Typography>
            <Typography component="h2" variant="h2">
              Sign in
            </Typography>
          </Box>
          <Grid>
            <TextField
              margin="dense"
              fullWidth
              required
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="dense"
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
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                my: 2,
              }}
            >
              <Button type="submit" variant="contained">
                Sign In
              </Button>

              <Button
                sx={{ m: 0.5 }}
                startIcon={<Google />}
                variant="contained"
                onClick={() => signInWithGoogle()}
              >
                use Google
              </Button>
            </Box>

            <Grid container sx={{ mt: 5 }}>
              <Grid item xs>
                <Link
                  href="signin/changepassword"
                  variant="body2"
                  underline="hover"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
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
