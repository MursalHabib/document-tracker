import React, { useState } from "react";
import {
  AppBar,
  Typography,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  CssBaseline,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  OutlinedInput,
  InputAdornment,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import TableDocs from "../helper/Table";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/id";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const Dashboard = (props) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const drawerWidth = 0;
  const theme = useTheme();
  const { window, setAuth } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [onRadio, setOnRadio] = useState("");
  const [submitted, setSubmitted] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileHardcopy, setPdfFileHardcopy] = useState(null);
  const [pdfFileError, setPdfFileError] = useState("");
  const [viewPdf, setViewPdf] = useState(null);
  const [viewPdfHardcopy, setViewPdfHardcopy] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [numPagesHardcopy, setNumPagesHardcopy] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageNumberHardcopy, setPageNumberHardcopy] = useState(1);
  const [fileName, setFileName] = useState(null);
  const [query, setQuery] = useState("");
  const [resultQuery, setResultQuery] = useState([]);
  const [loadingQuery, setLoadingQuery] = useState(false);
  const [softcopyFile, setSoftcopyFile] = useState({});

  const [inputData, setInputData] = useState({
    title: "",
    type: "",
    pic: "",
    position: "",
    info: "",
  });

  const handleQuery = (e) => {
    setLoadingQuery(true);
    try {
      setQuery(e.target.value);
      setTimeout(async () => {
        const result = await axios.get(
          `${BASE_URL}/api/v1/docs/search/files?title=${query}`
        );
        const { data } = result;
        setResultQuery(data);
        setLoadingQuery(false);
      }, 1000);
    } catch (error) {
      setLoadingQuery(false);
      console.error(error);
    }
  };

  const { title, type, pic, position, info } = inputData;

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

  const onChange = (e) =>
    setInputData({ ...inputData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { title, type, pic, position, info };
      const response = await axios.post(
        `${BASE_URL}/api/v1/docs/create`,
        body,
        {
          headers: {
            token: localStorage.token,
          },
        }
      );
      setDialogOpen(false);
      setRefresh((old) => old + 1);
      setSubmitted(body);
      toast.success("Dokumen berhasil dibuat", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //Function handle PDF File

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadSuccessHardcopy({ numPages }) {
    setIsLoading(false);
    setNumPagesHardcopy(numPages);
  }

  const fileType = ["application/pdf"];

  const handleHardcopyChange = (e) => {
    let selectedFile = e.target.files[0];
    setFileName(selectedFile.name);
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          setPdfFileHardcopy(e.target.result);
          setPdfFileError("");
        };
      } else {
        setPdfFileHardcopy(null);
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  const handleHardcopySubmit = (e) => {
    e.preventDefault();
    if (pdfFileHardcopy !== null) {
      setViewPdfHardcopy(pdfFileHardcopy);
    } else {
      setViewPdfHardcopy(null);
    }
  };

  const handleQueryClick = async (e) => {
    console.log(e.id);
    setQuery("");
    try {
      const result = await axios.get(`${BASE_URL}/api/v1/docs/files/${e.id}`, {
        // headers: {
        //   token: localStorage.token,
        // },
      });
      const { data } = result;
      setSoftcopyFile(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(resultQuery);

  return (
    <Grid container component="main" sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
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
        <Grid sx={{ display: "flex" }}>
          <Button
            color="secondary"
            disableElevation={true}
            variant="contained"
            sx={{ marginBottom: 2 }}
            onClick={() => setDialogOpen(true)}
          >
            Add Document
          </Button>
          <Button
            color="secondary"
            component={Link}
            to={"/upload-document"}
            sx={{ marginBottom: 2, marginLeft: "auto" }}
            startIcon={<FileUploadRoundedIcon />}
          >
            Upload File
          </Button>
        </Grid>

        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle
            sx={{ fontFamily: "Raleway", fontWeight: 700, textAlign: "center" }}
          >
            Add New Document
          </DialogTitle>
          <Box component="form" padding={2} onSubmit={onSubmit}>
            <TextField
              required
              margin="dense"
              id="name"
              label="Judul Dokumen"
              type="text"
              fullWidth
              variant="outlined"
              color="secondary"
              name="title"
              value={title}
              onChange={onChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="demo-simple-select-label" color="secondary">
                Jenis Dokumen *
              </InputLabel>
              <Select
                color="secondary"
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                name="type"
                label="Jenis Dokumen"
                onChange={onChange}
              >
                <MenuItem value={"Pengadaan"}>Pengadaan</MenuItem>
                <MenuItem value={"Kontrak"}>Kontrak</MenuItem>
                <MenuItem value={"SP"}>SP</MenuItem>
                <MenuItem value={"Amandemen & Side Letter"}>
                  Amandemen & Side Letter
                </MenuItem>
                <MenuItem value={"BAPP"}>BAPP</MenuItem>
                <MenuItem value={"Invoice"}>Invoice</MenuItem>
                <MenuItem value={"Nota Pesanan"}>Nota Pesanan</MenuItem>
                <MenuItem value={"Lainnya"}>Lainnya</MenuItem>
              </Select>
            </FormControl>
            <Box
              // width={"80%"}
              sx={{
                display: type === "BAPP" ? "flex" : "none",
                flexDirection: "column",
                marginTop: 2,
              }}
            >
              <Typography>Cari dokumen softcopy</Typography>
              <TextField
                fullWidth
                value={query}
                onChange={handleQuery}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loadingQuery ? (
                        <CircularProgress size={20} color="secondary" />
                      ) : (
                        <SearchIcon color="secondary" />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <List
                sx={{
                  display: query === "" ? "none" : "inline",
                  position: "absolute",
                  marginTop: 8,
                  backgroundColor: "white",
                  width: "95%",
                  zIndex: 111,
                  border: "1px solid lightgray",
                }}
              >
                {!resultQuery.length ? (
                  <Typography
                    variant="subtitle2"
                    color={"text.secondary"}
                    marginLeft={2}
                  >
                    no file found
                  </Typography>
                ) : (
                  resultQuery
                    .map((e, index) => (
                      <ListItem
                        disablePadding
                        key={index}
                        sx={{ backgroundColor: "white" }}
                      >
                        <ListItemButton
                          onClick={() => handleQueryClick(e)}
                          sx={{ padding: 0 }}
                        >
                          <ListItemText
                            sx={{ paddingInline: 1 }}
                            primary={e.title}
                            secondary={
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {moment(e.createdAt).format("Do MMM YY")}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))
                    .slice(0, 3)
                )}
              </List>
              <Typography>Add File Hardcopy</Typography>
              <OutlinedInput
                onChange={handleHardcopyChange}
                type="file"
                size="small"
                placeholder="Please enter text"
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      disabled={pdfFileHardcopy === null ? true : false}
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={handleHardcopySubmit}
                    >
                      Upload
                    </Button>
                  </InputAdornment>
                }
              />
              <Grid
                container
                columnSpacing={4}
                sx={{
                  marginTop: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid
                  item
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Document
                    file={softcopyFile.nama_file}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Typography variant="subtitle2" align="center">
                      {softcopyFile.title?.length > 25
                        ? softcopyFile.title?.slice(0, 25) + "...pdf"
                        : softcopyFile.title}
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid lightgray",
                      }}
                    >
                      <Page scale={0.3} pageNumber={pageNumber} />
                    </Box>

                    <Typography variant="subtitle2" align="center">
                      {numPages} Halaman
                    </Typography>
                  </Document>
                </Grid>
                <Grid
                  item
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Document
                    file={viewPdfHardcopy}
                    onLoadSuccess={onDocumentLoadSuccessHardcopy}
                  >
                    <Typography variant="subtitle2" align="center">
                      {fileName?.length > 20
                        ? fileName?.slice(0, 20) + "...pdf"
                        : fileName}
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid lightgray",
                      }}
                    >
                      <Page
                        scale={0.3}
                        pageNumber={pageNumberHardcopy}
                        // onClick={() => console.log("click")}
                      />
                    </Box>

                    <Typography variant="subtitle2" align="center">
                      {numPagesHardcopy} Halaman
                    </Typography>
                  </Document>
                </Grid>
              </Grid>
            </Box>

            {isLoading === false &&
              numPages !== null &&
              numPagesHardcopy !== null &&
              (numPages === numPagesHardcopy ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <CheckCircleIcon color={"success"} sx={{ marginRight: 1 }} />
                  <Typography color={"text.success"}>
                    Jumlah halaman sesuai
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <CancelIcon color={"error"} sx={{ marginRight: 1 }} />
                  <Typography color={"error"}>
                    Jumlah halaman tidak sesuai
                  </Typography>
                </Box>
              ))}

            <FormControl fullWidth margin="dense">
              <InputLabel id="demo-simple-select-label" color="secondary">
                PIC Dokumen *
              </InputLabel>
              <Select
                color="secondary"
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={pic}
                name="pic"
                label="PIC Dokumen"
                onChange={onChange}
              >
                <MenuItem value={"Mursal Habib"}>Mursal Habib</MenuItem>
                <MenuItem value={"Rudy"}>Rudy</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="demo-simple-select-label" color="secondary">
                Posisi Dokumen *
              </InputLabel>
              <Select
                color="secondary"
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={position}
                name="position"
                label="Posisi Dokumen"
                onChange={onChange}
              >
                <MenuItem value={"Executive General Manager"}>
                  Executive General Manager
                </MenuItem>
                <MenuItem value={"Senior Manager"}>Senior Manager</MenuItem>
                <MenuItem value={"Manager MS Procurement"}>
                  Manager MS Procurement
                </MenuItem>
                <MenuItem value={"Manager Non MS Procurement"}>
                  Manager Non MS Procurement
                </MenuItem>
                <MenuItem value={"Admin"}>Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              color="secondary"
              multiline
              rows={3}
              margin="dense"
              id="name"
              label="Keterangan"
              type="text"
              fullWidth
              variant="outlined"
              name="info"
              value={info}
              onChange={onChange}
            />
            <Button
              disabled={
                type === "BAPP" && numPages !== numPagesHardcopy ? true : false
              }
              type="submit"
              // fullWidth
              variant="outlined"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Document
            </Button>
            <Button
              onClick={() => setDialogOpen(false)}
              color="inherit"
              // fullWidth
              variant="text"
              sx={{ mt: 3, mb: 2, ml: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Dialog>
        <Grid item xs={12}>
          <TableDocs testRefresh={refresh} />
        </Grid>
      </Box>
    </Grid>
  );
};

export default Dashboard;
