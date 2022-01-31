import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
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
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ setAuth }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { state } = useLocation();
  // const { id } = state;

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password };
      const position = email === "000000" ? "Senior Manager" : null;
      const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, body);
      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        if (state) {
          const update = await axios.put(
            `${BASE_URL}/api/v1/docs/update/${state.id}`,
            { position },
            {
              headers: {
                token: localStorage.token,
              },
            }
          );
          toast.success("Berhasil update posisi dokumen", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          console.log("ISI UPDATE DOKUMEN: ", update);
        }
        setAuth(true);
        console.log("SUCCESSFULLY LOGIN...");
      } else {
        setAuth(false);
        toast.error("Incorrect email or password", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("LOGIN FAILED");
      }
    } catch (error) {
      toast.error("Incorrect email or password", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error(error);
    }
  };

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
            label="NIK"
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
