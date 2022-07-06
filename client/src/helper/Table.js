import React, { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import { alpha } from "@mui/material/styles";
// import { visuallyHidden } from "@mui/utils";
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
  TableRow,
  Typography,
  IconButton,
  Grid,
  useMediaQuery,
  Tooltip,
  Stack,
  Chip,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeRoundedIcon from "@mui/icons-material/QrCodeRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import QRCode from "react-qr-code";
import { useTheme } from "@mui/material/styles";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import moment from "moment";
import "moment/locale/id";

export default function EnhancedTable({ testRefresh }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [tableContent, setTableContent] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogQROpen, setDialogQROpen] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [dataChange, setDataChange] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const theme = useTheme();
  const componentRef = useRef();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const onChange = (e) => {
    setDataDetail({ ...dataDetail, [e.target.name]: e.target.value });
  };

  const { id, title, type, pic, position, info } = dataDetail;

  const onSubmit = async (e) => {
    setUpdateLoading(true);
    e.preventDefault();
    try {
      const body = { id, title, type, pic, position, info };
      await axios.put(`/docs/update/${body.id}`, body, {
        headers: {
          token: localStorage.token,
        },
      });
      setDialogOpen(false);
      setDataChange((old) => old + 1);
      setUpdateLoading(false);
      toast.success("Berhasil update dokumen", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setUpdateLoading(false);
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
      const res = await axios.get(`/docs/documents`, {
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
            <QrCodeRoundedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit Document" sx={{ display: "inline" }}>
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
    {
      field: "id",
      headerName: "No.",
      type: "number",
      width: 50,
      align: "center",
    },
    { field: "title", headerName: "Judul Dokumen", flex: 2 },
    { field: "type", headerName: "Tipe Dokumen", flex: 1 },
    {
      field: "pic",
      headerName: "PIC",
      flex: 1,
    },
    {
      field: "position",
      headerName: "Posisi Dokumen",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "info",
      headerName: "Keterangan",
      flex: 1,
    },
    {
      field: "aksi",
      headerName: "Aksi",
      flex: 1,
      sortable: false,
      renderCell: renderDetailsButton,
      disableClickEventBubbling: true,
    },
  ];

  const handleCloseDocument = async (e) => {
    setUpdateLoading(true);
    e.preventDefault();
    try {
      const body = { id, status: "closed" };
      await axios.put(`/docs/update/${body.id}`, body, {
        headers: {
          token: localStorage.token,
        },
      });
      setDataChange((old) => old + 1);
      setUpdateLoading(false);
      setConfirmDialog(false);
      setDialogOpen(false);
      toast.success("Berhasil close document", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setUpdateLoading(false);
      toast.error("Terjadi kesalahan, coba lagi nanti", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log(error);
    }
  };

  return (
    <Box sx={{ padding: 1, backgroundColor: "white" }}>
      <Typography
        variant="h6"
        fontFamily={"Raleway"}
        fontWeight="700"
        marginBottom={2}
      >
        List Tracking Dokumen
      </Typography>
      <div style={{ width: "100%", backgroundColor: "white" }}>
        <DataGrid
          loading={loading}
          disableSelectionOnClick={true}
          autoHeight={true}
          rows={tableContent}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          initialState={{
            sorting: {
              sortModel: [{ field: "id", sort: "asc" }],
            },
          }}
        />
      </div>

      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle
          sx={{ fontFamily: "Raleway", fontWeight: 700, textAlign: "center" }}
        >
          {dataDetail.status === "closed" ? "Document Closed" : "Edit Document"}
        </DialogTitle>
        <Box component="form" padding={2} onSubmit={onSubmit}>
          <TextField
            disabled={dataDetail.status === "closed" ? true : false}
            color="secondary"
            margin="dense"
            id="name"
            label="Judul Dokumen"
            type="text"
            fullWidth
            variant="outlined"
            name="title"
            value={dataDetail.title}
            onChange={onChange}
          />
          <Stack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "flex-start", alignItems: "center" }}
          >
            <FormControl
              fullWidth
              margin="dense"
              color="secondary"
              sx={{ flex: 6 }}
            >
              <InputLabel id="demo-simple-select-label">
                Jenis Dokumen
              </InputLabel>
              <Select
                disabled={dataDetail.status === "closed" ? true : false}
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
            <Typography sx={{ flex: 6 }}>
              Tanggal dibuat:{" "}
              {moment(dataDetail.createdAt).format("Do MMMM YYYY")}
            </Typography>
          </Stack>
          <FormControl fullWidth margin="dense" color="secondary">
            <InputLabel id="demo-simple-select-label">PIC Dokumen</InputLabel>
            <Select
              disabled={dataDetail.status === "closed" ? true : false}
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
          <FormControl fullWidth margin="dense" color="secondary">
            <InputLabel id="demo-simple-select-label">
              Posisi Dokumen
            </InputLabel>
            <Select
              disabled={dataDetail.status === "closed" ? true : false}
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
            disabled={dataDetail.status === "closed" ? true : false}
            color="secondary"
            margin="dense"
            id="name"
            label="Keterangan"
            type="text"
            fullWidth
            variant="outlined"
            name="info"
            value={dataDetail.info}
            onChange={onChange}
          />
          <Stack
            spacing={1}
            direction="row"
            sx={{ mt: 1, justifyContent: "flex-start", alignItems: "center" }}
          >
            {/* <Typography>Status: </Typography> */}
            <Chip
              color={
                dataDetail.status === "on progress" ? "default" : "success"
              }
              size="small"
              icon={
                dataDetail.status === "on progress" ? (
                  <AccessTimeIcon />
                ) : (
                  <CheckIcon />
                )
              }
              label={
                dataDetail.status === "on progress" ? "on progress" : "closed"
              }
            />
            <Button
              onClick={() => setConfirmDialog(true)}
              disabled={dataDetail.status === "on progress" ? false : true}
              size="small"
              color="error"
            >
              {dataDetail.status === "on progress"
                ? "close this document"
                : "closed by admin"}
            </Button>
          </Stack>

          <Stack
            spacing={2}
            direction="row"
            sx={{ mt: 3, justifyContent: "flex-start" }}
          >
            <LoadingButton
              disabled={dataDetail.status === "closed" ? true : false}
              type="submit"
              loading={updateLoading}
              color="secondary"
              variant="contained"
            >
              Update Document
            </LoadingButton>
            <Button
              onClick={() => setDialogOpen(false)}
              color="inherit"
              // fullWidth
              variant="text"
              sx={{ mt: 3, mb: 2, ml: 2 }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Dialog>
      <Dialog
        // fullWidth
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
      >
        <DialogTitle sx={{ fontFamily: "Raleway", fontWeight: 700 }}>
          Close this document?
        </DialogTitle>
        <DialogActions>
          <Button
            size="small"
            color="inherit"
            onClick={() => setConfirmDialog(false)}
          >
            cancel
          </Button>
          <Button size="small" color="error" onClick={handleCloseDocument}>
            close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={dialogQROpen}
        onClose={() => setDialogQROpen(false)}
      >
        <DialogTitle
          sx={{ fontFamily: "Raleway", fontWeight: 700, textAlign: "center" }}
        >
          QR Code Document
        </DialogTitle>
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
                padding: fullScreen ? 1 : 4,
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
