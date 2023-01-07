import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import moment from 'moment';
import axios from 'axios';
import { Modal, Select } from '@mui/material';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 'subject',
    numeric: false,
    disablePadding: false,
    label: 'Subject',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Full Name',
  },
  {
    id: 'course',
    numeric: false,
    disablePadding: false,
    label: 'Course Name',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Problem Type',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Problem Status',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created At',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function ProblemsTable(props) {
  const { rows } = props;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('createdAt');
  const [page, setPage] = React.useState(0);
  const [selectedRow, setSelectedRow] = React.useState(false);
  const [status, setStatus] = React.useState({ status: 'unseen' });
  const [reply, setReply] = React.useState('');
  const [replyError, setReplyError] = React.useState(false);
  const [rowData, setRowData] = React.useState({
    _id: '',
    user: {},
    course: {},
    type: '',
    status: '',
    subject: '',
    messages: [],
    createdAt: '',
    updatedAt: '',
    __v: 0,
  });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const options = [
    { value: 'unseen', label: 'unseen' },
    { value: 'pending', label: 'pending' },
    { value: 'resolved', label: 'resolved' },
    { value: 'closed', label: 'closed' },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getTicket = (data) => {
    axios
      .get(`/api/ticket/${data}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        setRowData(response.data.problem);
      });
  };

  const handleTicket = (id, change) => {
    axios
      .patch(`/api/ticket/${id}`, change, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((response) => {
        setRowData(response.data);
        setReply('');
        setReplyError(false);
        setStatus({ status: response.data.status });
      });
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          }}
        >
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            {props.title}
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row._id}
                      onClick={() => {
                        getTicket(row._id);
                        setSelectedRow(true);
                      }}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="1">
                        {row.subject}
                      </TableCell>

                      <TableCell align="left">{row.firstName + ' ' + row.lastName}</TableCell>
                      <TableCell align="left">{row.course}</TableCell>
                      <TableCell align="left">{row.type}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left" type="date">
                        {moment(row.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Modal
        open={selectedRow}
        onClose={() => setSelectedRow(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '80%', md: '50%' },
            maxHeight: '90%',
            overflow: 'scroll',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
          }}
        >
          <Box
            id="modal-modal-title"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
            }}
          >
            <Typography variant="h6" fontWeight="semiBold">
              Problem Details
            </Typography>
            <Button
              onClick={() => {
                setSelectedRow(false);
                window.location.reload();
              }}
              sx={{
                ml: 'auto',
                minWidth: 0,
                p: 0,
              }}
            >
              <CloseIcon sx={{ color: 'grey.700' }} />
            </Button>
          </Box>
          <Box id="modal-modal-description" sx={{ mt: 1 }}>
            <Stack direction="column" spacing={2}>
              <Stack direction="row">
                <Typography variant="subtitle1" minWidth="50%">
                  User's Full Name: {rowData.user.firstName + ' ' + rowData.user.lastName}
                </Typography>
                <Typography variant="subtitle1" minWidth="50%">
                  User's Role: {rowData.user.type}
                </Typography>
              </Stack>
              <Typography variant="subtitle1">Course: {rowData.course.title}</Typography>
              <Stack direction="row">
                <Typography variant="subtitle1" minWidth="50%">
                  Subject: {rowData.subject}
                </Typography>
                <Typography variant="subtitle1">Type: {rowData.type}</Typography>
              </Stack>

              <Box>
                <Stack direction="row">
                  <Typography variant="subtitle1">Status: {rowData.status}</Typography>
                  <Stack
                    sx={{
                      ml: 'auto',
                      minWidth: 0,
                      p: 0,
                    }}
                    direction="row"
                  >
                    <Select
                      options={options}
                      onChange={(choice) => setStatus({ status: choice.value })}
                    ></Select>
                    <Button
                      onClick={() => {
                        handleTicket(rowData._id, { status: status });
                        getTicket(rowData._id);
                      }}
                      variant="outlined"
                      sx={{ ml: '1rem' }}
                    >
                      Change Status
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
            {rowData.messages.map((message) => {
              if (message.user.type !== 'administrator') {
                return (
                  <Paper
                    sx={{
                      p: '0.5rem',
                      width: '50%',
                      bgcolor: 'grey.300',
                      mt: '1rem',
                    }}
                  >
                    <Typography variant="title1">{message.message}</Typography>
                    <Typography variant="body2">
                      {message.user.firstName + ' ' + message.user.lastName}
                    </Typography>
                    <Typography variant="body2">
                      {moment(message.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                    </Typography>
                  </Paper>
                );
              } else {
                return (
                  <Paper
                    sx={{
                      p: '0.5rem',
                      width: '50%',
                      bgcolor: 'grey.300',
                      ml: 'auto',
                      mt: '1rem',
                    }}
                  >
                    <Typography variant="title1">{message.message}</Typography>
                    <Typography variant="body2">Admin</Typography>
                    <Typography variant="body2">
                      {moment(message.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                    </Typography>
                  </Paper>
                );
              }
            })}
            <Stack spacing={1} mt="1rem">
              <TextField
                id="outlined-multiline-static"
                label="Reply"
                multiline
                rows={4}
                value={reply}
                variant="outlined"
                sx={{ borderColor: replyError ? 'error.main' : 'grey.700' }}
                onChange={(e) => {
                  setReplyError('');
                  setReply(e.target.value);
                }}
              />
              {replyError && (
                <Typography variant="body2" color="error">
                  {replyError}
                </Typography>
              )}
              <Button
                onClick={() => {
                  if (reply === '') {
                    setReplyError('Reply cannot be empty');
                    return;
                  }
                  handleTicket(rowData._id, { reply: reply });
                  getTicket(rowData._id);
                }}
                variant="contained"
                sx={{
                  bgcolor: 'secondary.main',
                }}
              >
                Reply
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
