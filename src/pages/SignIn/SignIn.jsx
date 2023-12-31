import { useEffect, useState } from "react";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
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
import showError from "src/components/Toasts/ToastError";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import { signInValidationSchema } from "src/util/validation/signInValidationSchema";

export default function SignIn() {
  const navigate = useNavigate();

  const { currentUser } = useAuthProvider();

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signInValidationSchema),
  });

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

  const signInOnSubmit = async (data) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        if (error.message === "Firebase: Error (auth/user-not-found).") {
          showError(
            "Sorry, we couldn't find this email in our database. If you don't have an account SignUp"
          );
        } else {
          showError(
            "An error with sign in has occured, check console for more info"
          );
          console.error(error);
        }
        reset();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <LoadingScreen />;
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
          onSubmit={handleSubmit(signInOnSubmit)}
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
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
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
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

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
                  sx={{ fontSize: ".9rem" }}
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
                  sx={{ fontSize: ".9rem" }}
                >
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
