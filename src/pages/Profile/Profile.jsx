import React, { useEffect } from "react";

import {
  Avatar,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import { useAuthProvider } from "src/contexts/AuthContext";

function Profile() {
  const currentUser = useAuthProvider();
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
            src={currentUser.currentUser.photoURL}
            sx={{ width: 50, height: 50 }}
          />
          <Typography variant="h1" sx={{ mx: 2 }}>
            {currentUser.currentUser.displayName}
          </Typography>
        </Grid>
        <Grid item xs={4} lg={8}>
          <Typography sx={{ m: 1 }}>E-mail Address</Typography>

          <TextField
            disabled
            id="outlined-disabled"
            defaultValue={currentUser.currentUser.email}
          />
        </Grid>
        <Grid item xs={4} lg={8}>
          <Button variant="outlined" sx={{ my: 1 }} onClick={changeEmail}>
            Change email
          </Button>{" "}
          <Button
            variant="outlined"
            sx={{ my: 1 }}
            href="profile/changepassword"
          >
            Change password
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;
