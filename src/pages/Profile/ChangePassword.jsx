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
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
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

  const isSignedInWithProvider = () => {
    return currentUser.providerData.some(
      (provider) => provider.providerId === "google.com"
    );
  };

  const changePasswordOnSubmit = async (data) => {
    if (isSignedInWithProvider()) {
      alert("You cannot change password using auth providers such as google!");
      return;
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      data.oldPassword
    );

    setLoading(true);
    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        updatePassword(currentUser, data.newPassword)
          .then(() => {
            setLoading(false);
            alert(
              "Your password has been changed successfully! Now you can login again!"
            );
            navigate("/signout");
          })
          .catch((error) => {
            setLoading(false);

            alert("Error while changing password, check console for more info");
            console.error(error);
          });
      })
      .catch((error) => {
        setLoading(false);
        alert(
          "Your old password is different, try again or reset your password"
        );
        console.error(error);
      });
  };

  const handleResetPassword = async () => {
    if (isSignedInWithProvider()) {
      alert("You cannot change password using auth providers such as google!");
      return;
    }

    setLoading(true);
    sendPasswordResetEmail(auth, currentUser.email)
      .then(() => {
        alert("Sent mail with password reset");
        setResetPasswordSent(true);
        setLoading(false);
      })
      .catch((error) => {
        alert("Error has occured, check console");
        console.error(error);
        setLoading(false);
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
              type="password"
            />
            <TextField
              margin="normal"
              label="New Password"
              name="newPassword"
              id="newPassword"
              {...register("newPassword")}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              type="password"
            />
            <TextField
              margin="normal"
              label="Confirm Password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              {...register("confirmNewPassword")}
              error={!!errors.confirmNewPassword}
              helperText={errors.confirmNewPassword?.message}
              type="password"
            />
            <Button variant="contained" sx={{ my: 2 }} type="submit">
              Change Password
            </Button>
            {!resetPasswordSent ? (
              <Button
                onClick={() => handleResetPassword()}
                variant="body2"
                underline="hover"
              >
                {"Forgot your password?"}
              </Button>
            ) : (
              <Button variant="body2" underline="hover" disabled={true}>
                {"Email sent! Check your inbox"}
              </Button>
            )}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default ChangePassword;
