import React from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Typography,
  AppBar,
  Grid,
  Box,
  Toolbar,
  IconButton,
  useMediaQuery,
  Breadcrumbs,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";

const UploadDocument = ({ setAuth }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);

      console.log("LOGGED OUT SUCCESSFULLY...");
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <Grid container component="main" sx={{ display: "flex", width: "100%" }}>
      <AppBar
        color="secondary"
        position="fixed"
        // sx={{
        //   width: { sm: `calc(100% - ${drawerWidth}px)` },
        //   ml: { sm: `${drawerWidth}px` },
        //   //   backgroundColor: "white",
        // }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mx: fullScreen ? 0 : 5,
          }}
        >
          <Typography variant="h5" fontFamily={"Oswald"}>
            WIMDO
          </Typography>
          <IconButton color="inherit" onClick={logout} sx={{ ml: 2 }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mx: fullScreen ? 0 : 5,
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" to="/">
            <Typography color="text.secondary" variant="caption">
              Dashboard
            </Typography>
          </Link>
          <Typography color="text.secondary" variant="caption">
            Upload Document
          </Typography>
        </Breadcrumbs>
        <Typography>Halaman upload dokumen</Typography>
      </Box>
    </Grid>
  );
};

export default UploadDocument;
