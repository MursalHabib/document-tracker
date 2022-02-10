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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
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
        `${BASE_URL}/api/v1/auth/verify`,
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
      <ToastContainer />
      <Routes>
        <Route
          exact
          path="/login"
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
                <CircularProgress size={60} />
              </Box>
            ) : !isAuthenticated ? (
              <Login setAuth={setAuth} />
            ) : (
              <Navigate to="/" />
            )
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
                <CircularProgress size={60} />
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
