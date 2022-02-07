import React, { useState } from "react";
import {
  Drawer,
  AppBar,
  Typography,
  Divider,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  IconButton,
  InputBase,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  OutlinedInput,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import TableDocs from "../helper/Table";
import axios from "axios";
import QRCode from "react-qr-code";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "react-toastify";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const Dashboard = (props) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const drawerWidth = 0;
  const theme = useTheme();
  const { window, setAuth } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSuccessOpen, setDialogSuccessOpen] = useState(false);
  const [onRadio, setOnRadio] = useState("");
  const [submitted, setSubmitted] = useState({});
  const [refresh, setRefresh] = useState(0);

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

  const [inputData, setInputData] = useState({
    title: "",
    type: "",
    pic: "",
    position: "",
    info: "",
  });

  const { title, type, pic, position, info } = inputData;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "40ch",
      },
    },
  }));

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
      // setDialogSuccessOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ margin: 1 }}>
          Document Tracker
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {["Menu 1", "Menu 2", "Menu 3", "Menu 4"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //Function handle PDF File

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadSuccessHardcopy({ numPages }) {
    setNumPagesHardcopy(numPages);
  }

  const fileType = ["application/pdf"];
  const handleSoftcopyChange = (e) => {
    let selectedFile = e.target.files[0];
    setFileName(selectedFile.name);
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          setPdfFile(e.target.result);
          setPdfFileError("");
        };
      } else {
        setPdfFile(null);
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  const handleSoftcopySubmit = (e) => {
    e.preventDefault();
    if (pdfFile !== null) {
      setViewPdf(pdfFile);
    } else {
      setViewPdf(null);
    }
  };

  const handleHardcopyChange = (e) => {
    let selectedFile = e.target.files[0];
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

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        color="secondary"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          //   backgroundColor: "white",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mx: 5,
          }}
        >
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h5" fontFamily={"Oswald"}>
            WIMDO
          </Typography>
          <IconButton color="inherit" onClick={logout} sx={{ ml: 2 }}>
            <LogoutIcon />
          </IconButton>

          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search> */}
        </Toolbar>
      </AppBar>
      {/* <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box> */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mx: 5,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Button
          color="secondary"
          disableElevation={true}
          variant="contained"
          sx={{ marginBottom: 2 }}
          onClick={() => setDialogOpen(true)}
        >
          Add Document
        </Button>
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle>Add New Document</DialogTitle>
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
            <RadioGroup
              onChange={(e) => setOnRadio(e.target.value)}
              sx={{ display: type === "BAPP" ? "inline" : "none" }}
            >
              <FormControlLabel
                value="Softcopy"
                control={<Radio color="secondary" />}
                label="Softcopy"
              />
              <FormControlLabel
                value="Hardcopy"
                control={<Radio color="secondary" />}
                label="Hardcopy"
              />
            </RadioGroup>
            <FormControl
              fullWidth
              sx={{
                display:
                  onRadio === "Softcopy" && type === "BAPP"
                    ? "inline-block"
                    : "none",
              }}
            >
              <OutlinedInput
                onChange={handleSoftcopyChange}
                type="file"
                size="small"
                placeholder="Please enter text"
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="inherit"
                      size="small"
                      type="submit"
                      onClick={handleSoftcopySubmit}
                    >
                      Upload
                    </Button>
                  </InputAdornment>
                }
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 3,
                }}
              >
                <Document file={viewPdf} onLoadSuccess={onDocumentLoadSuccess}>
                  <Box sx={{ border: "1px solid lightgray" }}>
                    <Page scale={0.3} pageNumber={pageNumber} />
                  </Box>
                  <Typography variant="subtitle2" align="center">
                    {numPages} Halaman
                  </Typography>
                </Document>
              </Box>
            </FormControl>
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                display:
                  onRadio === "Hardcopy" && type === "BAPP" ? "flex" : "none",
              }}
            >
              <Typography variant="subtitle1">Dokumen Softcopy:</Typography>
              <Typography variant="subtitle2">{fileName}</Typography>
              <Box
                sx={{
                  display: "flex",
                  marginTop: 3,
                }}
              >
                <Document file={viewPdf} onLoadSuccess={onDocumentLoadSuccess}>
                  <Box sx={{ border: "1px solid lightgray" }}>
                    <Page scale={0.3} pageNumber={pageNumber} />
                  </Box>
                  <Typography variant="subtitle2" align="center">
                    {numPages} Halaman
                  </Typography>
                </Document>
              </Box>
              {/* <InputLabel htmlFor="outlined-adornment-password">
                Cari Dokumen Softcopy
              </InputLabel> */}
              {/* <OutlinedInput
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                label="Cari Dokumen Softcopy"
              /> */}
            </FormControl>
            {viewPdf !== null && (
              <FormControl
                margin="dense"
                fullWidth
                sx={{
                  display:
                    onRadio === "Hardcopy" && type === "BAPP"
                      ? "inline-block"
                      : "none",
                }}
              >
                <Typography variant="h7">Attach File Hardcopy</Typography>
                <OutlinedInput
                  onChange={handleHardcopyChange}
                  type="file"
                  size="small"
                  placeholder="Please enter text"
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        color="inherit"
                        size="small"
                        onClick={handleHardcopySubmit}
                      >
                        Upload
                      </Button>
                    </InputAdornment>
                  }
                />
                <Box
                  sx={{
                    display: "flex",
                    marginTop: 3,
                  }}
                >
                  <Document
                    file={viewPdfHardcopy}
                    onLoadSuccess={onDocumentLoadSuccessHardcopy}
                  >
                    <Box sx={{ border: "1px solid lightgray" }}>
                      <Page scale={0.3} pageNumber={pageNumberHardcopy} />
                    </Box>
                    <Typography variant="subtitle2" align="center">
                      {numPagesHardcopy} Halaman
                    </Typography>
                  </Document>
                </Box>
                {numPages !== null &&
                  numPagesHardcopy !== null &&
                  (numPages === numPagesHardcopy ? (
                    <Typography>Jumlah halaman sesuai</Typography>
                  ) : (
                    <Typography>Jumlah halaman tidak sesuai</Typography>
                  ))}
              </FormControl>
            )}

            <FormControl fullWidth margin="normal">
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
        <Dialog
          fullWidth
          open={dialogSuccessOpen}
          onClose={() => setDialogSuccessOpen(false)}
        >
          <DialogTitle sx={{ textAlign: "center" }}>
            Document Added Successfully!
          </DialogTitle>
          <DialogContent>
            <Grid
              sx={{
                border: "1px solid grey",
                width: 450,
                marginBlock: 5,
              }}
            >
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ margin: 0 }}>Judul Dokumen</TableCell>
                    <TableCell>{submitted.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jenis Dokumen</TableCell>
                    <TableCell>{submitted.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PIC</TableCell>
                    <TableCell>{submitted.pic}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Posisi Dokumen</TableCell>
                    <TableCell>{submitted.position}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Keterangan</TableCell>
                    <TableCell>{submitted.info}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
            <Grid sx={{ textAlign: "center" }}>
              <QRCode
                value={"Posisi Dokumen: \n" + submitted.position}
                size={200}
              />
            </Grid>
            <Grid sx={{ textAlign: "center" }}>
              <Button
                onClick={() => setDialogSuccessOpen(false)}
                color="inherit"
                // fullWidth
                variant="text"
              >
                Close
              </Button>
            </Grid>
          </DialogContent>
        </Dialog>
        <TableDocs testRefresh={refresh} />
      </Box>
    </Box>
  );
};

export default Dashboard;
