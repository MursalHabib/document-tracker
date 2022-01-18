import "./App.css";
// import axios from "axios";
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    checkIsAuthenticated();
  }, []);

  return (
    <div className="container">
      <Routes>
        <Route
          exact
          path="/login"
          element={
            !isAuthenticated ? (
              <Login setAuth={setAuth} />
            ) : (
              <Navigate to="/dashboard" />
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
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          exact
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
