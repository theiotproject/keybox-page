import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as RouterLink } from "react-router-dom";
import { auth } from "../../backend/db";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import ErrorMsg from "../../components/ErrorMsg";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { useState } from "react";
export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [firebaseErros, setFirebaseErrors] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  let password = watch("password");

  const onSubmit = async (data) => {
    //TODO: walidacja formularza rejestracji i logowania (ux)
    console.log("Validation result: " + JSON.stringify(errors));
    console.log(data);

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

  if (loading) {
    return <CircularProgress />;
  }

  if (firebaseErros) {
    return (
      <ErrorMsg errorMessage="Wystąpił nieznany błąd z bazą danych, sprawdź konsolę po więcej informacji" />
    );
  }

  if (success) {
    console.log("zaladowalem");
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
                {...register("firstName", {
                  required: "First Name is required",
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
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
                {...register("lastName", { required: "Last Name is required" })}
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
                {...register("email", {
                  required: "Email is required",
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                })}
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
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="validatePassword"
                label="Confirm Password"
                type="password"
                id="validatePassword"
                autoComplete="off"
                {...register("validatePassword", {
                  required: "Please enter your password to confirm",
                  validate: (match) => {
                    match === password || "Passwords do not match";
                  },
                })}
                error={!!errors.validatePassword}
                helperText={errors.validatePassword?.message}
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
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
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
