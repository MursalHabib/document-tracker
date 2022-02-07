import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Chip,
  Grid,
  useMediaQuery,
  Tooltip,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import SearchIcon from "@mui/icons-material/Search";
import QRCode from "react-qr-code";
import { useTheme } from "@mui/material/styles";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "no",
    numeric: false,
    disablePadding: true,
    label: "No.",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Judul Dokumen",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "Jenis Dokumen",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "PIC",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "Posisi Dokumen",
  },
  {
    id: "protein",
    numeric: true,
    disablePadding: false,
    label: "Keterangan",
  },
  {
    id: "aksi",
    numeric: true,
    disablePadding: false,
    label: "Aksi",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable({ testRefresh }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const BASE_URL_CLIENT = process.env.REACT_APP_BASE_URL_CLIENT;

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableContent, setTableContent] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogQROpen, setDialogQROpen] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [dataChange, setDataChange] = useState(0);
  const [query, setQuery] = useState("");
  const theme = useTheme();
  const componentRef = useRef();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const EnhancedTableToolbar = (props) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          List Dokumen
        </Typography>
        <TextField
          color="secondary"
          placeholder="Cari dokumen"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          autoFocus
          sx={{ width: 500 }}
          size="small"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const onChange = (e) => {
    setDataDetail({ ...dataDetail, [e.target.name]: e.target.value });
  };

  const { id, title, type, pic, position, info } = dataDetail;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { id, title, type, pic, position, info };
      await axios.put(`${BASE_URL}/api/v1/docs/update/${body.id}`, body, {
        headers: {
          token: localStorage.token,
        },
      });
      setDialogOpen(false);
      setDataChange((old) => old + 1);
      toast.success("Berhasil update dokumen", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("Uh oh ada kesalahan di server :(", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleEdit = (i) => {
    setDialogOpen(true);
    setDataDetail(i);
  };

  const handleViewQR = (i) => {
    setDialogQROpen(true);
    setDataDetail(i);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/docs/documents`, {
        headers: {
          token: localStorage.token,
        },
      });
      setTableContent(res.data);
      setLoading(false);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
    return () => {};
  }, [testRefresh, dataChange]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableContent.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableContent.length}
            />
            <TableBody>
              {loading === true ? (
                <Typography variant="h5" align="center" marginTop={3}>
                  loading...
                </Typography>
              ) : (
                tableContent
                  .filter((name) =>
                    name.title.match(
                      new RegExp(
                        query.replace(/([.^$|*+?()\[\]{}\\-])/g, "\\$1"),
                        "i"
                      )
                    )
                  )
                  .sort((a, b) => a.id - b.id)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        // aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        // selected={isItemSelected}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="normal"
                        >
                          {row.id}
                        </TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.pic}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.position}
                            color={
                              row.position === "Executive General Manager"
                                ? "success"
                                : row.position === "Senior Manager"
                                ? "primary"
                                : "default"
                            }
                            variant={
                              row.position === "Executive General Manager"
                                ? "filled"
                                : "outlined"
                            }
                          />
                          {/* <QrCodeIcon
                          color="secondary"
                          sx={{
                            position: "absolute",
                            marginLeft: -1.5,
                            marginTop: 2,
                            backgroundColor: "white",
                          }}
                        /> */}
                        </TableCell>
                        <TableCell>{row.info}</TableCell>
                        <TableCell>
                          <Tooltip title="Show QR Code">
                            <IconButton
                              color="secondary"
                              aria-label="qr code"
                              onClick={() => handleViewQR(row)}
                            >
                              <QrCodeIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Document">
                            <IconButton
                              color="primary"
                              aria-label="edit"
                              onClick={() => handleEdit(row)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
              {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={
            tableContent.filter((name) =>
              name.title.match(
                new RegExp(
                  query.replace(/([.^$|*+?()\[\]{}\\-])/g, "\\$1"),
                  "i"
                )
              )
            ).length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog fullWidth open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Document</DialogTitle>
        <Box component="form" padding={2} onSubmit={onSubmit}>
          <TextField
            margin="normal"
            id="name"
            label="Judul Dokumen"
            type="text"
            fullWidth
            variant="outlined"
            name="title"
            value={dataDetail.title}
            onChange={onChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Jenis Dokumen</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="type"
              value={dataDetail.type}
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">PIC Dokumen</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dataDetail.pic}
              name="pic"
              label="PIC Dokumen"
              onChange={onChange}
            >
              <MenuItem value={"Mursal Habib"}>Mursal Habib</MenuItem>
              <MenuItem value={"Rudy"}>Rudy</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">
              Posisi Dokumen
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dataDetail.position}
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
            margin="normal"
            id="name"
            label="Keterangan"
            type="text"
            fullWidth
            variant="outlined"
            name="info"
            value={dataDetail.info}
            onChange={onChange}
          />
          <Button
            type="submit"
            variant="outlined"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Document
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
        open={dialogQROpen}
        onClose={() => setDialogQROpen(false)}
      >
        <DialogTitle>Detail & QR Document</DialogTitle>
        <Box padding={2}>
          <Grid
            sx={{
              height: "100%",
            }}
          >
            <Box ref={componentRef} sx={{ alignItems: "center", padding: 5 }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ margin: 0 }}>Judul Dokumen</TableCell>
                    <TableCell>{dataDetail.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jenis Dokumen</TableCell>
                    <TableCell>{dataDetail.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>PIC</TableCell>
                    <TableCell>{dataDetail.pic}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Posisi Dokumen</TableCell>
                    <TableCell>{dataDetail.position}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Keterangan</TableCell>
                    <TableCell>{dataDetail.info}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Grid sx={{ textAlign: "center", marginTop: 10 }}>
                <QRCode
                  value={"http://localhost:3000/update/" + dataDetail.id}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid sx={{ textAlign: "center" }}>
            <ReactToPrint
              pageStyle={{ alignItems: "center" }}
              documentTitle={dataDetail.title}
              trigger={() => <Button color="secondary">Print</Button>}
              content={() => componentRef.current}
              pageStyle="@page { size: 8.3in 11.7in }"
            />
            <Button
              onClick={() => setDialogQROpen(false)}
              color="inherit"
              // fullWidth
              variant="text"
            >
              Close
            </Button>
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
}
