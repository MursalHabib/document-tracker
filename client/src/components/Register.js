import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Typography } from "@mui/material";

const Register = () => {
  return (
    <>
      <Typography variant="h4">Register Page</Typography>
      <div>
        <Link to="/login">login</Link>
      </div>
      <Link to="/dashboard">dashboard</Link>
    </>
  );
};

export default Register;
