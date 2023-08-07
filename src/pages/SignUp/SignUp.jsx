import { useState } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Google } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ErrorMsg from "src/components/ErrorMsg";
import LeftSide from "src/components/LeftSide";
import LeftSideMobile from "src/components/LeftSideMobile";
import LoadingScreen from "src/components/LoadingScreen";
import showError from "src/components/Toasts/ToastError";
import showWarning from "src/components/Toasts/ToastWarning";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import { signUpValidationSchema } from "src/util/validation/SignUpSchema";

export default function SignUp() {
  const { currentUser } = useAuthProvider();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpValidationSchema),
  });

  // Sign Up user with Google Provider
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);

  if (errorGoogle) {
    showError(
      "Error while creating user using Google Provider, check console for more info"
    );
    console.error(errorGoogle);
    return;
  }

  // Sign Up user with Email and Password
  const signUpOnSubmit = async (data) => {
    setLoading(true);

    // check if provided email is available
    fetchSignInMethodsForEmail(auth, data.email)
      .then((signInMethods) => {
        if (signInMethods.length > 0) {
          showWarning("That email is already in use");
          reset();
          return;
        }
      })
      .catch((error) => {
        showError(
          "Error while checking for email availability, check console for more info"
        );
        console.error(error);
        reset();
        return;
      })
      .finally(() => {
        setLoading(false);
      });

    // create user
    const user = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    ).catch((error) => {
      showError("Error while creating a user, check console for more info");
      console.error(error);
      return;
    });

    // update user's profile picture and display name
    if (user && auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: `${data.firstName} ${data.lastName}`,
        photoURL: `https://source.unsplash.com/collection/1103088/300x300`,
      })
        .then(() => {
          // send user an verification email
          sendEmailVerification(auth.currentUser)
            .catch((error) => {
              showError(
                "Error while sending an verification email, check console for more info"
              );
              console.error(`Error: ${error.code} - ${error.message}`);
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((error) => {
          showError(
            "Error while sending an verification email, check console for more info"
          );
          console.error(`Error: ${error.code} - ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (loading || loadingGoogle) {
    return <LoadingScreen />;
  }

  if (userGoogle || currentUser) {
    navigate("/dashboard");
  }

  return (
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
        onSubmit={handleSubmit(signUpOnSubmit)}
        sx={{
          px: { xs: 3, md: 5 },
          width: { xs: 1, md: 1 / 2 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ alignContent: "flex-start", mb: 2 }}>
          <Typography component="h1" variant="h1">
            Hello!
          </Typography>
          <Typography component="h2" variant="h2">
            Sign up to get started
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
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
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
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
              {...register("password")}
              error={!!errors.password}
              helperText={errors.passowrd?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="c-password"
              label="Confirm Password"
              type="password"
              id="c-password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Grid>
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
          <Button type="submit" variant="contained" sx={{ m: 0.5 }}>
            Sign Up
          </Button>

          <Button
            startIcon={<Google />}
            variant="contained"
            sx={{ m: 0.5 }}
            onClick={() => signInWithGoogle()}
          >
            {" "}
            use Google
          </Button>
        </Box>
        <Grid container justifyContent="center">
          <Grid item>
            <Link
              to={`/signin`}
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
  );
}
