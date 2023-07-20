import React from "react";

import {
  Avatar,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

function Profile() {
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
          <Avatar alt="Your Avatar" src="" sx={{ width: 50, height: 50 }} />
          <Typography variant="h1" sx={{ mx: 2 }}>
            Jan Kowalski
          </Typography>
        </Grid>
        <Grid item xs={4} lg={8}>
          <Typography sx={{ m: 1 }}>E-mail Address</Typography>

          <TextField
            disabled
            id="outlined-disabled"
            defaultValue="jkowalski@gmail.com"
          />
        </Grid>
        <Grid item xs={4} lg={8}>
          <Button variant="outlined" sx={{ my: 1 }}>
            Change email
          </Button>{" "}
          <Button variant="outlined" sx={{ my: 1 }} href="/changepassword">
            Change password
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;
