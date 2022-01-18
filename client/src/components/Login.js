import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Container,
  Box,
  Card,
  Button,
  FormControlLabel,
  Grid,
} from "@mui/material";
import axios from "axios";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        body
      );
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        setAuth(true);
        console.log("SUCCESSFULLY LOGIN...");
      } else {
        setAuth(false);
        console.log("LOGIN FAILED");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { email, password } = inputs;
  return (
    <Container component="main" maxWidth="xs">
      <Card
        sx={{
          marginTop: 8,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Login</Typography>

        <Box component="form" onSubmit={onSubmitForm} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </Box>
      </Card>
    </Container>
  );
};

export default Login;
