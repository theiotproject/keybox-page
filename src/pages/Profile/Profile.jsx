import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
} from "firebase/auth";
import { auth } from "src/backend/db_config";
import { useAuthProvider } from "src/contexts/AuthContext";
import * as yup from "yup";

// Form yup validation schema
const schema = yup
  .object({
    email: yup.string().required("Email field is required").email(),
  })
  .required();

function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { currentUser } = useAuthProvider();
  const [isChangingEmail, setChangingEmail] = useState(false);
  const previousEmail = currentUser.email;
  const [isLoading, setLoading] = useState();
  const navigate = useNavigate();

  const isSignedInWithProvider = () => {
    return currentUser.providerData.some(
      (provider) => provider.providerId === "google.com"
    );
  };

  const changeEmailOnSubmit = async (data) => {
    if (data.email === previousEmail) {
      alert("Your new email must be different from previous one");
      return;
    }

    if (isSignedInWithProvider()) {
      alert("You cannot change email using auth providers such as google!");
      return;
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      data.password
    );

    setLoading(true);
    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        updateEmail(currentUser, data.email)
          .then(() => {
            setLoading(false);
            alert("Check your new email address for verification link");
            sendEmailVerification(currentUser).then(() => {
              navigate("/signout");
            });
          })
          .catch((error) => {
            setLoading(false);
            alert("Error occured while updating email, check console");
            console.error(error);
          });
      })
      .catch((error) => {
        setLoading(false);
        alert(
          "Error occured while revalidating your credentials, check console"
        );
        console.error(error);
      });
  };

  return (
    <Container>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="left"
        spacing={2}
        sx={{
          mt: 5,
          ml: 5,
        }}
      >
        <Grid item xs={4} lg={12} display="flex">
          <Avatar
            alt="Your Avatar"
            src={currentUser.photoURL}
            sx={{ width: 50, height: 50 }}
          />
          <Typography variant="h1" sx={{ mx: 2 }}>
            {currentUser.displayName}
          </Typography>
        </Grid>
        <Grid item xs={4} lg={8}>
          <Typography sx={{ m: 1 }}>E-mail Address</Typography>

          {isLoading ? (
            <CircularProgress />
          ) : (
            <Grid>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
                component="form"
                noValidate
                onSubmit={handleSubmit(changeEmailOnSubmit)}
              >
                <TextField
                  disabled={!isChangingEmail}
                  id="email"
                  name="email"
                  defaultValue={currentUser.email}
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                {isChangingEmail && (
                  <>
                    <TextField
                      id="password"
                      name="password"
                      defaultValue={currentUser.password}
                      {...register("password")}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      type="password"
                    />
                    <Button type="submit">Confirm</Button>
                  </>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
        <Grid item xs={4} lg={8}>
          {!isSignedInWithProvider() && (
            <>
              <Button
                variant="outlined"
                sx={{ my: 1 }}
                onClick={() => setChangingEmail(true)}
              >
                Change email
              </Button>{" "}
              <Button
                variant="outlined"
                sx={{ my: 1 }}
                href="profile/changepassword"
              >
                Change password
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;
