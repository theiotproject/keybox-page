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
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
export default function SignUp() {
  const schema = yup
    .object({
      firstName: yup.string().required("First Name field is required"),
      lastName: yup.string().required("Last Name field is required"),
      email: yup.string().required("Email field is required"),
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

  const [loading, setLoading] = useState(false);
  const [firebaseErros, setFirebaseErrors] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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
