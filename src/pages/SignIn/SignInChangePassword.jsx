import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import LoadingScreen from "src/components/LoadingScreen";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "src/backend/db_config";
import * as yup from "yup";

// Form yup validation schema
const schema = yup
  .object({
    email: yup
      .string()
      .required("Emial field is required")
      .email("You must provide us propper email address"),
  })
  .required();

function SignInChangePassword() {
  const [isLoading, setLoading] = useState(false);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleResetPassword = async (email) => {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Sent mail with password reset");
        setResetPasswordSent(true);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error has occured while sending email, check console");
        console.error(error);
        setLoading(false);
      });
  };

  const sendEmailResetOnSubmit = async (data) => {
    fetchSignInMethodsForEmail(auth, data.email)
      .then((signInMethods) => {
        if (signInMethods.includes("google.com")) {
          alert(
            "You cannot change password using auth providers such as google!"
          );
          return;
        }

        if (signInMethods.length > 0) {
          handleResetPassword(data.email);
          navigate("/signin");
        } else {
          alert("There are no users with this email address");
        }
      })
      .catch((error) => {
        alert(
          "Error has occured while trying to find your account, check console for more info"
        );
        console.error(error);
      });
  };

  return (
    <Container>
      {/* the form */}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(sendEmailResetOnSubmit)}
        >
          <Grid
            container
            display="flex"
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ py: 5 }}
          >
            <Typography variant="h2">Send password reset</Typography>
            <TextField
              margin="normal"
              name="email"
              id="email"
              label="Email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              type="email"
            />
            <Button variant="contained" sx={{ my: 2 }} type="submit">
              Send Password Reset
            </Button>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default SignInChangePassword;
