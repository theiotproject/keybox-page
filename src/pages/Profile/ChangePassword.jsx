import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import ErrorMsg from "src/components/ErrorMsg";
import LoadingScreen from "src/components/LoadingScreen";

import { yupResolver } from "@hookform/resolvers/yup";
import { EmailAuthProvider, signOut } from "firebase/auth";
import { reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import * as yup from "yup";

// Form yup validation schema
const schema = yup
  .object({
    oldPassword: yup
      .string()
      .required("New Password field is required")
      .min(8, "Password length should be at least 8 characters")
      .max(32, "Password cannot exceed more than 32 characters"),
    newPassword: yup
      .string()
      .required("New Password field is required")
      .min(8, "Password length should be at least 8 characters")
      .max(32, "Password cannot exceed more than 32 characters"),
    confirmNewPassword: yup
      .string()
      .required("Confirm Password field is required")
      .min(8, "Password length should be at least 8 characters")
      .max(32, "Password cannot exceed more than 32 characters")
      .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  })
  .required();

function ChangePassword() {
  const { currentUser } = useAuthProvider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const changePasswordOnSubmit = async (data) => {
    const isSignedInWithProvider = currentUser.providerData.some(
      (provider) => provider.providerId === "google.com"
    );

    if (isSignedInWithProvider) {
      alert("You cannot change password using auth providers such as google!");
      return;
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      data.oldPassword
    );

    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        updatePassword(currentUser, data.newPassword)
          .then(() => {
            alert(
              "Your password has been changed successfully! Now you can login again!"
            );
            signOut(auth);
          })
          .catch((error) => {
            alert("Error while changing password, check console for more info");
            console.error(error);
          });
      })
      .catch((error) => {
        alert(
          "Your old password is different, try again or reset your password"
        );
        console.error(error);
      });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorMsg errorMessage="Unknown error has occured, check console for more info. " />
    );
  }

  return (
    <Container>
      {/* the form */}
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(changePasswordOnSubmit)}
      >
        <Grid
          container
          display="flex"
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ py: 5 }}
        >
          <Typography variant="h2">Change your password</Typography>
          <TextField
            margin="normal"
            name="oldPassword"
            id="oldPassword"
            label="Old Password"
            autoFocus
            {...register("oldPassword")}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
          />
          <TextField
            margin="normal"
            label="New Password"
            name="newPassword"
            id="newPassword"
            {...register("newPassword")}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            margin="normal"
            label="Confirm Password"
            name="confirmNewPassword"
            id="confirmNewPassword"
            {...register("confirmNewPassword")}
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
          />
          <Button variant="contained" sx={{ my: 2 }} type="submit">
            Change Password
          </Button>
          <Link to={`/#`} variant="body2" underline="hover">
            {"Forgot your password?"}
          </Link>
        </Grid>
      </Box>
    </Container>
  );
}

export default ChangePassword;
