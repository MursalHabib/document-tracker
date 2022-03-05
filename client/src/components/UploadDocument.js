import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  TextField,
  Stack,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import ArticleIcon from "@mui/icons-material/Article";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";

const UploadDocument = ({ setAuth }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [viewFiles, setViewFiles] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailFile, setDetailFile] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [inputs, setInputs] = useState({
    title: "",
    file: "",
  });
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState([]);

  console.log(selected);

  // const { title, file } = inputs;

  const onChangeTitle = (e) => setTitle(e.target.value);

  const onChangeFile = (e) => setFile(e.target.files[0]);

  const getFiles = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/docs/files`, {
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
  }, [refresh]);

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

  const handleViewFile = (i, e) => {
    e.stopPropagation();
    setDialogOpen(true);
    setDetailFile(i);
  };

  const renderDetailsButton = (params) => {
    return (
      <>
        <Button
          color="secondary"
          startIcon={<ArticleIcon />}
          onClick={(e) => handleViewFile(params.row, e)}
        >
          View
        </Button>
      </>
    );
  };

  const columns = [
    {
      field: "id",
      headerName: "No.",
      maxWidth: 50,
      align: "center",
      type: "number",
    },
    {
      field: "title",
      headerName: "Nama File",
      flex: 2,
    },
    {
      field: "files",
      headerName: "Aksi",
      flex: 1,
      renderCell: renderDetailsButton,
    },
  ];

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    try {
      await axios.post(`${BASE_URL}/api/v1/docs/upload`, formData, {
        headers: {
          token: localStorage.token,
          "content-type": "multipart/form-data",
        },
      });
      setRefresh((old) => old + 1);
      setTitle("");
      setFile(null);
      setIsLoadingSubmit(false);
      toast.success("File berhasil di upload", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setIsLoadingSubmit(false);
      console.log(error.message);
      toast.error("Ada kesalahan di server", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteRow = async (e) => {
    e.preventDefault();
    const body = { id: selected };
    try {
      await axios.delete(`${BASE_URL}/api/v1/docs/files/delete`, {
        headers: {
          token: localStorage.token,
        },
        data: {
          id: selected,
        },
      });

      setRefresh((old) => old + 1);
      toast.success("File berhasil dihapus", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.log(error.message);
      toast.error("Ada kesalahan di server", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
          mx: fullScreen ? 0 : 10,
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
            Upload File
          </Typography>
        </Breadcrumbs>
        <Grid container marginTop={2} spacing={4}>
          <Grid item md={4} xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" fontFamily={"Raleway"} fontWeight="700">
                Upload File
              </Typography>
              <Box component="form" onSubmit={handleSubmitFile} sx={{ mt: 1 }}>
                <TextField
                  color="secondary"
                  size="small"
                  margin="normal"
                  fullWidth
                  id="title"
                  label="Nama File"
                  name="title"
                  value={title}
                  onChange={onChangeTitle}
                />
                <TextField
                  type="file"
                  color="secondary"
                  size="small"
                  margin="normal"
                  fullWidth
                  id="file"
                  name="file"
                  onChange={onChangeFile}
                />
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{ mt: 3, justifyContent: "flex-end" }}
                >
                  {/* <Button variant="text">clear</Button> */}
                  {/* <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={!title.length || file === null ? true : false}
                  >
                    upload
                  </Button> */}
                  <LoadingButton
                    disabled={!title.length || file === null ? true : false}
                    type="submit"
                    color="secondary"
                    loading={isLoadingSubmit}
                    loadingPosition="start"
                    startIcon={<FileUploadRoundedIcon />}
                    variant="contained"
                  >
                    {isLoadingSubmit === true ? "uploading" : "upload"}
                  </LoadingButton>
                </Stack>
              </Box>
            </Box>
          </Grid>
          <Grid item md={8} xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                marginBottom={3}
              >
                <Typography
                  variant="h6"
                  fontFamily={"Raleway"}
                  fontWeight="700"
                >
                  List File
                </Typography>

                <Button
                  disabled={!selected.length ? true : false}
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteRow}
                >
                  delete
                </Button>
              </Stack>

              <div style={{ width: "100%" }}>
                <DataGrid
                  loading={isLoading}
                  autoHeight={true}
                  rows={viewFiles}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  checkboxSelection
                  sx={{ padding: 1 }}
                  disableSelectionOnClick={true}
                  onSelectionModelChange={(newSelection) => {
                    setSelected(newSelection);
                  }}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "id", sort: "asc" }],
                    },
                  }}
                />
              </div>
            </Box>
          </Grid>
        </Grid>

        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <Typography sx={{ textAlign: "center", marginTop: 3 }}>
            {detailFile.title}
          </Typography>
          <iframe
            src={detailFile.nama_file}
            width={"100%"}
            height={700}
          ></iframe>
        </Dialog>
      </Box>
    </Grid>
  );
};

export default UploadDocument;
