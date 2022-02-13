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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import QRCode from "react-qr-code";
import { useTheme } from "@mui/material/styles";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";

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

  const handleEdit = (i, e) => {
    e.stopPropagation();
    setDialogOpen(true);
    setDataDetail(i);
  };

  const handleViewQR = (i, e) => {
    e.stopPropagation();
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

  const renderDetailsButton = (params) => {
    return (
      <>
        <Tooltip title="Show QR Code">
          <IconButton
            color="secondary"
            aria-label="qr code"
            onClick={(e) => handleViewQR(params.row, e)}
          >
            <QrCodeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Document">
          <IconButton
            color="primary"
            aria-label="edit"
            onClick={(e) => handleEdit(params.row, e)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  const columns = [
    { field: "id", headerName: "No.", width: 70, type: "number" },
    { field: "title", headerName: "Judul Dokumen", width: 300 },
    { field: "type", headerName: "Tipe Dokumen", width: 130 },
    {
      field: "pic",
      headerName: "PIC",
      width: 150,
    },
    {
      field: "position",
      headerName: "Posisi Dokumen",
      width: 250,
    },
    {
      field: "info",
      headerName: "Keterangan",
      width: 200,
    },
    {
      field: "aksi",
      headerName: "Aksi",
      width: 100,
      sortable: false,
      renderCell: renderDetailsButton,
      disableClickEventBubbling: true,
    },
  ];

  return (
    <Box>
      <div style={{ width: "100%", backgroundColor: "white" }}>
        <DataGrid
          loading={loading}
          disableSelectionOnClick={true}
          autoHeight={true}
          rows={tableContent}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>

      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
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
              <MenuItem value={"Admin"}>Admin</MenuItem>
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
            <Box
              ref={componentRef}
              sx={{
                alignItems: "center",
                padding: fullScreen ? 1 : 5,
              }}
            >
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
                  {/* <TableRow>
                    <TableCell>Posisi Dokumen</TableCell>
                    <TableCell>{dataDetail.position}</TableCell>
                  </TableRow> */}
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
