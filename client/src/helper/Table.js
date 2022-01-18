import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

function createData(no, name, calories, fat, carbs, protein, aksi) {
  return {
    no,
    name,
    calories,
    fat,
    carbs,
    protein,
    aksi,
  };
}

const rows = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
];

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
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
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
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ testRefresh }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tableContent, setTableContent] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [jenis, setJenis] = useState("");
  const [dataChange, setDataChange] = useState(0);

  // console.log("ISI TITLE: ", dataDetail);

  const onChange = (e) => {
    setDataDetail({ ...dataDetail, [e.target.name]: e.target.value });
  };

  const { id, title, type, pic, position, info } = dataDetail;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { id, title, type, pic, position, info };
      // console.log("APA ISI BODY:  ", body);
      const response = await axios.put(
        `http://localhost:5000/api/v1/docs/update/${body.id}`,
        body,
        {
          headers: {
            token: localStorage.token,
          },
        }
      );
      console.log("APA ISI RESPONSE: ", response);
      setDialogOpen(false);
      setDataChange((old) => old + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const eventRow = (i) => {
    setDialogOpen(true);
    setDataDetail(i);
    // console.log("ISI EVENT ROW: ", i);
  };

  const getData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/docs/documents",
        {
          headers: {
            token: localStorage.token,
          },
        }
      );
      setTableContent(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeJenis = (event) => {
    setJenis(event.target.value);
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

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
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tableContent.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {/* stableSort(tableContent, getComparator(order, orderBy)) */}
              {tableContent
                .sort((a, b) => a.id - b.id)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  // const isItemSelected = isSelected(row.name);
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
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell> */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.title}</TableCell>
                      <TableCell align="right">{row.type}</TableCell>
                      <TableCell align="right">{row.pic}</TableCell>
                      <TableCell align="right">{row.position}</TableCell>
                      <TableCell align="right">{row.info}</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => eventRow(row)}>edit</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 25, 50, 100]}
          component="div"
          count={tableContent.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        fullWidth
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        sx={{ marginTop: -30 }}
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
            // fullWidth
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Document
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
