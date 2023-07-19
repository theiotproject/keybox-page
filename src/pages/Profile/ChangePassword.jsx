import React from "react";
import { useForm } from "react-hook-form";

import {
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
import { useAuthProvider } from "src/contexts/AuthContext";
import * as yup from "yup";

// Form yup validation schema
const schema = yup
  .object({
    firstName: yup.string().required("First Name field is required"),
    lastName: yup.string().required("Last Name field is required"),
    email: yup.string().required("Email field is required").email(),
    password: yup
      .string()
      .required("Password field is required")
      .min(8, "Password length should be at least 8 characters")
      .max(32, "Password cannot exceed more than 32 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password field is required")
      .min(8, "Password length should be at least 8 characters")
      .max(32, "Password cannot exceed more than 32 characters")
      .oneOf([yup.ref("password")], "Passwords do not match"),
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
    setLoading(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorMsg errorMessage="Unknown error has occured, check console for more info. " />
    );
  }

  if (success) {
    navigate("/dashboard");
  }

  return (
    <Container>
      {/* the form */}
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(changePasswordOnSubmit)}
        sx={{
          px: { xs: 3, md: 5 },
          width: { xs: 1, md: 1 / 2 },
          display: "flex",
          flexDirection: "column",
        }}
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
            label="Old Password"
            {...register("oldPassword")}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
          />
          <TextField
            margin="normal"
            label="New Password"
            {...register("newPassword")}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            margin="normal"
            label="Confirm Password"
            {...register("confrimNewPassword")}
            error={!!errors.confrimNewPassword}
            helperText={errors.confrimNewPassword?.message}
          />
          <Button variant="contained" sx={{ my: 2 }} on>
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
