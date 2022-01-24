import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
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

const Dashboard = (props) => {
  const drawerWidth = 200;
  const { window, setAuth } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSuccessOpen, setDialogSuccessOpen] = useState(false);
  const [onRadio, setOnRadio] = useState("");
  const [inputData, setInputData] = useState({
    title: "",
    type: "",
    pic: "",
    position: "",
    info: "",
  });
  const [submitted, setSubmitted] = useState({});
  const theme = useTheme();

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

  const [refresh, setRefresh] = useState(0);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { title, type, pic, position, info };
      const response = await axios.post(
        "http://localhost:5000/api/v1/docs/create",
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
      setDialogSuccessOpen(true);
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
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
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

  return (
    <Box sx={{ display: "flex" }} className="m-0 p-0">
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          //   backgroundColor: "white",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Box
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
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Button
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
              margin="dense"
              id="name"
              label="Judul Dokumen"
              type="text"
              fullWidth
              variant="outlined"
              name="title"
              value={title}
              onChange={onChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="demo-simple-select-label">
                Jenis Dokumen
              </InputLabel>
              <Select
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
                control={<Radio />}
                label="Softcopy"
              />
              <FormControlLabel
                value="Hardcopy"
                value="Hardcopy"
                control={<Radio />}
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
                type="file"
                size="small"
                placeholder="Please enter text"
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="contained" color="inherit" size="small">
                      Upload
                    </Button>
                  </InputAdornment>
                }
              />
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
              <InputLabel htmlFor="outlined-adornment-password">
                Cari Dokumen Softcopy
              </InputLabel>
              <OutlinedInput
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                label="Cari Dokumen Softcopy"
              />
            </FormControl>
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
                type="file"
                size="small"
                placeholder="Please enter text"
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="contained" color="inherit" size="small">
                      Upload
                    </Button>
                  </InputAdornment>
                }
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-label">PIC Dokumen</InputLabel>
              <Select
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
              <InputLabel id="demo-simple-select-label">
                Posisi Dokumen
              </InputLabel>
              <Select
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
              type="submit"
              // fullWidth
              variant="outlined"
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
