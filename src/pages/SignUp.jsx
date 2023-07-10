import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Copyright from "../components/Copyright";
import { Link as RouterLink } from "react-router-dom";
import bgimage from "../assets/bg.jpg";
import logo from "../assets/logo.png";




export default function SignUp() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <Container component="main" maxWidth='xl' sx={{alignItems: "center"}}>
      <CssBaseline />
      
      <Box
        sx={{
          display: "flex",
          flexDirection: {xs:'column', md:'column', xl:'row'},
          alignItems: "center",
        }}
      >
      {/* logo for mobile */}
      <Box  sx={{backgroundImage: `url(${bgimage})`,  backgroundRepeat: "no-repeat", backgroundSize: 'cover', width:{ xs:1, md: 1, xl: 1/2 }, 
      height: '11rem', alignItems: "center", justifyContent:'center', display:{xs:'flex', md: 'flex', xl:'none'}, flexDirection: "column"}}>
      <Box
        alignItems='flex-start'
        component="img"
        sx={{height: '7rem', width: '7rem', mt: 1}}
        alt="logo"
        src={logo}
      />
      <Grid container direction="column" justifyContent="center" alignItems="center">
      <Typography component="body2" variant="body2" alignContent='left'>
        storing your keys has never been easier!
      </Typography>
      </Grid>
      </Box>
      {/* left side of pc and laptops */}
      <Box  sx={{backgroundImage: `url(${bgimage})`,  backgroundRepeat: "no-repeat", backgroundSize: 'cover', width: { xs:1, md: 1, xl: 1/2 }, height: '93vh', alignItems: "center", display: {xs:'none', md:'none', xl:"flex"}, flexDirection: "column", }}>
      <Box
        alignContent='center'
        component="img"
        sx={{height: '30rem', width: '30rem', mt: 5}}
        alt="logo"
        src={logo}
      />
      <Grid container direction="column" justifyContent="center" alignItems="flex-start" sx={{p: 5}}>
      <Typography component="h3" variant="h3" alignContent='left' >
        Key Box
      </Typography>
      <Typography component="body2" variant="body2" alignContent='left'>
        storing your keys has never been easier!
      </Typography>
      <Button
            type="button"
            width='30%'
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: 30, backgroundColor: '#3AA090'}}
          >
            Visit our website
      </Button>
      </Grid>
      </Box>
      {/* the form */}
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ p:{ xs:1, md: 1, xl: 10 }, width:{ xs:1, md: 1, xl: 1/2 }, display: "flex", flexDirection: 'column'}}>
        <Box sx={{alignContent: 'flex-start'}}>
        <Typography component="h1" variant="h1">
          Hello!
        </Typography>
        <Typography component="h2" variant="h2">
          Sign up to get started
        </Typography>
        </Box>
          <Grid container spacing={2} sx={{mt: 5}}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
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
            sx={{ mt: 3, mb: 2}}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid item sx={{mb:5}}>
              <Link to={`/auth/SignIn`} variant="body2" component={RouterLink} underline="hover">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright />
    </Container>
  );
}
