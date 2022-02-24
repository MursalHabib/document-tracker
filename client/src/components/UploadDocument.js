import React, { useState, useEffect } from "react";
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
  Dialog,
  Button,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const UploadDocument = ({ setAuth }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [viewFiles, setViewFiles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const url = "https://cors-anywhere.herokuapp.com/" + viewFiles[1]?.nama_file;
  console.log(viewFiles);

  const getFiles = async () => {
    try {
      const res = await axios(`${BASE_URL}/api/v1/docs/files`, {
        method: "GET",
        // headers: {
        //   token: localStorage.token,
        // },
      });
      setViewFiles(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

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
        <Toolbar variant="dense" />
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" to="/">
            <Typography color="text.secondary" variant="caption">
              Dashboard
            </Typography>
          </Link>
          <Typography color="text.secondary" variant="caption">
            Upload File
          </Typography>
        </Breadcrumbs>
        <Grid container>
          <Grid item lg={5} md={12}>
            <Typography>Test1</Typography>
          </Grid>
          <Grid item lg={7} md={12}>
            <Typography>Test2</Typography>
          </Grid>
        </Grid>
        <Button
          color="secondary"
          disableElevation={true}
          sx={{ marginBottom: 2 }}
          onClick={() => setDialogOpen(true)}
        >
          view
        </Button>
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <Document
            file={viewFiles[0]?.nama_file}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Box>
              <Page pageNumber={pageNumber} />
            </Box>
            <Typography variant="subtitle2" align="center">
              {numPages} Halaman
            </Typography>
          </Document>
        </Dialog>
      </Box>
    </Grid>
  );
};

export default UploadDocument;
