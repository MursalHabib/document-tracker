import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  TextField,
  Box,
  Button,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "axios";
// import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = ({ setAuth }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { state } = useLocation();
  const EGM = "111111";
  const SM = "000000";

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const { email, password } = inputs;

  const onChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const body = { email, password };
      const position =
        email === SM
          ? "Senior Manager"
          : email === EGM
          ? "Executive General Manager"
          : null;
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
        setIsLoading(false);
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
        setIsLoading(false);
        console.log("LOGIN FAILED");
      }
    } catch (error) {
      toast.error(
        error.response.status === 429
          ? error.response.data
          : error.response.data.message,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      setIsLoading(false);
      console.error("PESAN ERR: ", error.response.status);
      console.log(error.response.headers);
      console.log(error.response.data);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{ backgroundColor: "#f4f4f4", height: "100vh" }}
    >
      <Grid container marginX={{ xs: 1, md: 1, lg: 20, sm: 1 }} marginTop={6}>
        <Grid item md={7} display={{ xs: "none", md: "block", lg: "block" }}>
          <Box
            sx={{
              paddingInline: 8,
              paddingBlock: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "purple",
              height: 260,
            }}
          >
            <Typography variant="h2" fontFamily={"Oswald"} color={"white"}>
              WIMDO
            </Typography>
            <Typography variant="h6" color={"white"}>
              Where Is My Document?
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              paddingInline: 8,
              paddingBlock: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              height: 260,
            }}
          >
            <Typography
              variant="h4"
              fontFamily={"Raleway"}
              fontWeight="700"
              color={"secondary"}
            >
              Login
            </Typography>

            <Box component="form" onSubmit={onSubmitForm} sx={{ mt: 1 }}>
              <TextField
                color="secondary"
                size="small"
                margin="normal"
                fullWidth
                id="email"
                label="NIK"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={onChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AccountCircleIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                color="secondary"
                size="small"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type={isVisible ? "password" : "text"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        sx={{ marginRight: -1 }}
                        onClick={() => setIsVisible(!isVisible)}
                      >
                        {isVisible ? (
                          <VisibilityIcon color="secondary" />
                        ) : (
                          <VisibilityOffIcon color="secondary" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {isLoading ? (
                <Button
                  disabled
                  color="secondary"
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Loading...
                </Button>
              ) : (
                <Button
                  color="secondary"
                  disabled={!email.length || !password.length ? true : false}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
