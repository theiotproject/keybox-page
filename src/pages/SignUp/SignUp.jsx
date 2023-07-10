import { useState } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Google } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
import LoadingScreen from "src/components/LoadingScreen";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "src/backend/db";
import { useAuthProvider } from "src/contexts/AuthContext";
import * as yup from "yup";

export default function SignUp() {
  //TODO: PASSWORD STRENGHT METTER https://upmostly.com/tutorials/build-a-password-strength-meter-react

  const { currentUser } = useAuthProvider();

  const [loading, setLoading] = useState(false);
  const [firebaseErros, setFirebaseErrors] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);

  // Form yup validation schema
  const schema = yup
    .object({
      firstName: yup.string().required("First Name field is required"),
      lastName: yup.string().required("Last Name field is required"),
      email: yup
        .string()
        .required("Email field is required")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Your Email is incorrect"
        ),
      password: yup
        .string()
        .required("Password field is required")
        .min(8, "Password length should be at least 8 characters")
        .max(32, "Password cannot exceed more than 32 characters"),
      validatePassword: yup
        .string()
        .required("Confirm Password field is required")
        .min(8, "Password length should be at least 8 characters")
        .max(32, "Password cannot exceed more than 32 characters")
        .oneOf([yup.ref("password")], "Passwords do not match"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const user = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    ).catch((error) => {
      return <ErrorMsg errorCode={error.code} errorMessage={error.message} />;
    });

    if (user && auth.currentUser) {
      updateProfile(auth.currentUser, {
        displayName: `${data.firstName} ${data.lastName}`,
        photoURL: `https://source.unsplash.com/collection/1103088/300x300`,
      })
        .then(() => {
          sendEmailVerification(auth.currentUser)
            .catch((error) => {
              setFirebaseErrors(true);
              setLoading(false);
              console.error(`Error: ${error.code} - ${error.message}`);
            })
            .finally(() => {
              setLoading(false);
              setSuccess(true);
            });
        })
        .catch((error) => {
          setFirebaseErrors(true);
          setLoading(false);
          console.error(`Error: ${error.code} - ${error.message}`);
        });
    }
  };

  if (loading || loadingGoogle) {
    return <LoadingScreen />;
  }

  if (firebaseErros || errorGoogle) {
    return (
      <ErrorMsg errorMessage="Wystąpił nieznany błąd z bazą danych, sprawdź konsolę po więcej informacji" />
    );
  }

  if (success || userGoogle || currentUser) {
    navigate("/dashboard");
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolorh: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
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
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="validatePassword"
                id="validatePassword"
                label="Confirm Password"
                type="password"
                autoComplete="off"
                error={!!errors.validatePassword}
                helperText={errors.validatePassword?.message}
                {...register("validatePassword")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
          >
            Sign Up
          </Button>
          <Button
            startIcon={<Google />}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => signInWithGoogle()}
          >
            Sign With Google
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to={`/signin`} variant="body2" component={RouterLink}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
