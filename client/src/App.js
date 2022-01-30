import "./App.css";
// import axios from "axios";
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import UpdateDoc from "./helper/UpdateDocument";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const checkIsAuthenticated = async () => {
    try {
      const data = {};
      const token = {
        headers: { token: localStorage.token },
      };
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/verify",
        data,
        token
      );
      response.data === true
        ? setIsAuthenticated(true)
        : setIsAuthenticated(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    }
  };

  useEffect(() => {
    checkIsAuthenticated();
  }, []);

  return (
    <div>
      <Routes>
        <Route
          exact
          path="/login"
          element={
            !isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/" />
          }
        />
        <Route
          exact
          path="/register"
          element={
            !isAuthenticated ? (
              <Register setAuth={setAuth} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          exact
          path="/"
          element={
            isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress size={80} />
                <Typography variant="h4" sx={{ marginLeft: 5 }}>
                  Loading Data...
                </Typography>
              </Box>
            ) : isAuthenticated ? (
              <Dashboard setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          exact
          path="/update/:id"
          element={<UpdateDoc setAuth={setAuth} />}
        />
      </Routes>
    </div>
  );
}

export default App;
