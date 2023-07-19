import React from "react";

import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

function ChangePassword() {
  return (
    <Container>
      <Grid
        container
        display="flex"
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ py: 5 }}
      >
        <Typography variant="h2">Change your password</Typography>
        <TextField margin="normal" label="Old Password" />
        <TextField margin="normal" label="New Password" />
        <TextField margin="normal" label="Confirm Password" />
        <Button variant="contained" sx={{ my: 2 }}>
          Change Password
        </Button>
        <Link to={`/#`} variant="body2" underline="hover">
          {"Forgot your password? Get an email to reset it."}
        </Link>
      </Grid>
    </Container>
  );
}

export default ChangePassword;
