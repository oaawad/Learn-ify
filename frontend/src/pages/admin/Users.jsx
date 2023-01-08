import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { styled, useTheme } from '@mui/material/styles';
import {
  Modal,
  Typography,
  Button,
  Paper,
  Stack,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import UsersTable from './UsersTable';
import { toast } from 'react-toastify';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function Users(props) {
  const theme = useTheme();
  const [individuals, setIndividuals] = React.useState([]);
  const [noOfUsers, setNoOfUsers] = React.useState(0);
  const [userPercentageChange, setUserPercentageChange] = React.useState(0);
  const [instructors, setInstructors] = React.useState([]);
  const [noOfInstructors, setNoOfInstructors] = React.useState(0);
  const [instructorPercentageChange, setInstructorPercentageChange] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [openAdmin, setOpenAdmin] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);
  const [password, setPassword] = React.useState('');

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const {
    register: registerAdmin,
    handleSubmit: handleSubmitAdmin,
    setError: setErrorAdmin,
    clearErrors: clearErrorsAdmin,
    formState: { errors: errorsAdmin },
  } = useForm();

  const submitInvitation = (data) => {
    axios
      .post(
        `/api/users/instructors/invite`,
        { email: data.email },
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      )
      .then((res) => {
        toast.success('Invitation sent successfully');
        setOpen(false);
      })
      .catch((err) => {
        setError('email', {
          type: 'email',
          message: err.response.data.message,
        });
      });
  };

  const submitAdminAcc = (data) => {
    if (data.password !== data.password2) {
      setErrorAdmin('passMiss', {
        type: 'custom',
        message: 'Passwords do not match',
      });
      return;
    }
    axios
      .post(`/api/users/admins`, data, {
        headers: {
          Authorization: `Bearer ${props.user.token}`,
        },
      })
      .then((res) => {
        toast.success('Admin account created successfully');
        setOpenAdmin(false);
      })
      .catch((err) => {
        setErrorAdmin('email', {
          type: 'email',
          message: err.response.data.message,
        });
      });
  };

  React.useEffect(() => {
    if (props.user) {
      axios
        .get('/api/users', {
          headers: {
            Authorization: 'Bearer ' + props.user.token,
          },
        })
        .then((response) => {
          setIndividuals(response.data.individuals.rows);
          setNoOfUsers(response.data.individuals.number);
          setUserPercentageChange(response.data.individuals.percentageChange);
          setInstructors(response.data.instructors.rows);
          setNoOfInstructors(response.data.instructors.number);
          setInstructorPercentageChange(response.data.instructors.percentageChange);
        });
    }
  }, []);

  return (
    <Main
      open={props.open}
      sx={{
        bgcolor: 'grey.400',
        flexGrow: 1,
        display: props.active === 'Dashboard' ? 'block' : 'none',
      }}
    >
      <DrawerHeader />

      <Stack direction="row" sx={{ mb: '2rem' }}>
        <Paper elevation={0} sx={{ p: '1rem', minWidth: '15rem' }}>
          <Typography variant="subtitle1" sx={{ color: 'grey.600', fontWeight: 'semiBold' }}>
            Total Individuals
          </Typography>
          <Stack direction="row">
            <Typography variant="h5" sx={{ fontWeight: 'semiBold' }}>
              {noOfUsers}
            </Typography>

            <Stack
              direction="row"
              sx={{
                color:
                  userPercentageChange > 0
                    ? 'success.main'
                    : userPercentageChange > 0
                    ? 'error.main'
                    : 'grey.600',
                justifyContent: 'center',
                alignItems: 'center',
                ml: '0.5rem',
              }}
            >
              {userPercentageChange > 0 && <ArrowCircleUpIcon fontSize="inherit" />}
              {userPercentageChange < 0 && <ArrowCircleDownIcon fontSize="inherit" />}
              {userPercentageChange === 0 && <RemoveCircleOutlineIcon fontSize="inherit" />}
              <Typography variant="body1" fontWeight="medium">
                {userPercentageChange}%
              </Typography>
            </Stack>
          </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: '1rem', mx: '1rem', minWidth: '15rem' }}>
          <Typography variant="subtitle1" sx={{ color: 'grey.600', fontWeight: 'semiBold' }}>
            Total Instructors
          </Typography>
          <Stack direction="row">
            <Typography variant="h5" sx={{ fontWeight: 'semiBold' }}>
              {noOfInstructors}
            </Typography>
            <Stack
              direction="row"
              sx={{
                color:
                  instructorPercentageChange > 0
                    ? 'success.main'
                    : instructorPercentageChange > 0
                    ? 'error.main'
                    : 'grey.600',
                justifyContent: 'center',
                alignItems: 'center',
                ml: '0.5rem',
              }}
            >
              {instructorPercentageChange > 0 && <ArrowCircleUpIcon fontSize="inherit" />}
              {instructorPercentageChange < 0 && <ArrowCircleDownIcon fontSize="inherit" />}
              {instructorPercentageChange === 0 && <RemoveCircleOutlineIcon fontSize="inherit" />}
              <Typography variant="body1" fontWeight="medium">
                {instructorPercentageChange}%
              </Typography>
            </Stack>
          </Stack>
        </Paper>
        <Stack direction="column" sx={{ mt: 'auto', ml: 'auto', color: 'grey.800' }} spacing={1}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            sx={{ bgcolor: 'grey.800', fontWeight: 'semiBold' }}
            onClick={() => setOpenAdmin(true)}
          >
            Create Admin
          </Button>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            sx={{ bgcolor: 'grey.800', fontWeight: 'semiBold' }}
            onClick={() => setOpen(true)}
          >
            Invite Instructor
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ mb: '2rem' }}>
        <UsersTable rows={individuals} title="Individuals" />
      </Box>
      <Box>
        <UsersTable rows={instructors} title="Instructors" />
      </Box>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { sm: '80%', md: '30%' },
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
            <Typography variant="h6" component="h2">
              Send Invite Link
            </Typography>
            <Button
              onClick={() => setOpen(false)}
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
            <form onSubmit={handleSubmit(submitInvitation)}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Instructor's Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Email is required',
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errors.email}
                  helperText={errors.email && errors.email.message}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'grey.800',
                    color: 'white',
                    fontWeight: 'semiBold',
                    height: '2.5rem',
                  }}
                  type="submit"
                >
                  Send
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openAdmin}
        onClose={() => setOpenAdmin(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { sm: '80%', md: '30%' },
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
            <Typography variant="h6" component="h2">
              Create Admin Account
            </Typography>
            <Button
              onClick={() => setOpenAdmin(false)}
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
            <form onSubmit={handleSubmitAdmin(submitAdminAcc)}>
              <Stack direction="column" spacing={2}>
                <TextField
                  label="Admin's Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...registerAdmin('email', {
                    required: {
                      value: true,
                      message: 'Email is required',
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errorsAdmin.email}
                  helperText={errorsAdmin.email && errorsAdmin.email.message}
                />
                <TextField
                  label="Admin's Username"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...registerAdmin('username', {
                    required: {
                      value: true,
                      message: 'Username is required',
                    },
                  })}
                  error={errorsAdmin.username}
                  helperText={errorsAdmin.username && errorsAdmin.username.message}
                />
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label="Password"
                  variant="outlined"
                  {...registerAdmin('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    onChange: (e) => setPassword(e.target.value),
                  })}
                  error={errorsAdmin?.password || errorsAdmin?.passMiss ? true : false}
                  helperText={errorsAdmin?.password && errorsAdmin.password.message}
                  fullWidth
                  sx={{ marginTop: '1rem' }}
                  size="small"
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type={showPassword2 ? 'text' : 'password'}
                  name="password2"
                  label="Confirm Password"
                  variant="outlined"
                  {...registerAdmin('password2', {
                    required: 'Confirm Password is required',
                    onChange: (e) => {
                      if (e.target.value === password) {
                        clearErrorsAdmin('passMiss');
                      }
                    },
                  })}
                  error={errorsAdmin?.passMiss || errorsAdmin?.password2 ? true : false}
                  helperText={
                    (errorsAdmin?.password2 && errorsAdmin.password2.message) ||
                    (errorsAdmin?.passMiss && errorsAdmin.passMiss.message)
                  }
                  fullWidth
                  sx={{ marginTop: '1rem' }}
                  size="small"
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword2}
                          onMouseDown={handleMouseDownPassword2}
                        >
                          {showPassword2 ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'grey.800',
                    color: 'white',
                    fontWeight: 'semiBold',
                  }}
                  type="submit"
                >
                  Create Account
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Modal>
    </Main>
  );
}

export default Users;
