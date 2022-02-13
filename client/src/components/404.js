import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Typography, Grid, Button } from "@mui/material";

const notFound = () => {
  return (
    <Grid
      sx={{
        display: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography fontSize={200} fontFamily={"Oswald"} color="text.secondary">
        404
      </Typography>
      <Typography variant="h5">OOPS, PAGE NOT FOUND!</Typography>
      <Button color="secondary" sx={{ marginTop: 5 }} component={Link} to={"/"}>
        Back to Home
      </Button>
    </Grid>
  );
};

export default notFound;
