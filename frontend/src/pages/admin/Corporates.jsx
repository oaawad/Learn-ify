import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { styled, useTheme } from '@mui/material/styles';
import { Modal, Typography, Button, Paper, Stack, Box, TextField, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CorpTable from './CorpTable';
import { toast } from 'react-toastify';
import ReactHookFormSelect from '../../components/ReactHookFormSelect';
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
  const [corporates, setCorporates] = React.useState([]);
  const [noOfCorporates, setNoOfCorporates] = React.useState(0);
  const [corporatesPercentageChange, setCorporatesPercentageChange] = React.useState(0);
  const [noOfStudents, setNoOfStudents] = React.useState(0);
  const [openAddCorp, setOpenAddCorp] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [emails, setEmails] = React.useState([]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    setError: setErrorInvite,
    formState: { errors: errorsInvite },
    setValue: setValueInvite,
    getValues: getValuesInvite,
    control,
  } = useForm();
  const {
    register: registerCheck,
    handleSubmit: handleSubmitCheck,
    setError: setErrorCheck,
    setValue: setValueCheck,
    formState: { errors: errorsCheck },
  } = useForm();

  const submitAddCorp = (data) => {
    axios
      .post(
        `/api/corporate`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      )
      .then((res) => {
        setCorporates((prev) => [...prev, res.data]);
        setNoOfCorporates((prev) => prev + 1);
        toast.success('Corporate added successfully');
        setOpenAddCorp(false);
      })
      .catch((err) => {
        setError('name', {
          type: 'name',
          message: err.response.data.message,
        });
      });
  };
  const submitInvite = (data) => {
    if (emails.length === 0) {
      setErrorCheck('email', {
        type: 'email',
        message: 'Please add at least one email',
      });
      return;
    }
    if (!data.corporate) {
      setErrorInvite('corporate', {
        type: 'corporate',
        message: 'Please select a corporate',
      });
      return;
    }
    axios
      .post(
        `/api/corporate/${corporates[data.corporate]._id}`,
        { emails },
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      )
      .then((res) => {
        toast.success('Invitation sent successfully');
        setEmails([]);
        setValueInvite('corporate', undefined);
        setValueCheck('email', '');
        setOpen(false);
      })
      .catch((err) => {
        setErrorInvite('email', {
          type: 'email',
          message: err.response.data.message,
        });
      });
  };
  const submitCheck = (data) => {
    if (emails.includes(data.email)) {
      setErrorCheck('email', {
        type: 'email',
        message: 'Email already added',
      });
      return;
    }
    axios
      .post(
        `/api/corporate/check`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${props.user.token}`,
          },
        }
      )
      .then((res) => {
        setEmails((prev) => [...prev, data.email]);
        setValueCheck('email', '');
      })
      .catch((err) => {
        setErrorCheck('email', {
          type: 'email',
          message: err.response.data.message,
        });
      });
  };
  const handleRemoveEmail = (email) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };
  React.useEffect(() => {
    if (props.user) {
      axios
        .get('/api/corporate', {
          headers: {
            Authorization: 'Bearer ' + props.user.token,
          },
        })
        .then((response) => {
          setCorporates(response.data.corporates);
          setNoOfCorporates(response.data.corporates.length);
          setCorporatesPercentageChange(response.data.corporatesPercentageChange);
          setNoOfStudents(response.data.totalAccounts);
        });
    }
  }, []);

  return (
    <Main
      open={props.open}
      sx={{
        bgcolor: 'grey.400',
        flexGrow: 1,
        display: props.active === 'Corporates' ? 'block' : 'none',
      }}
    >
      <DrawerHeader />

      <Stack direction="row" sx={{ mb: '2rem' }}>
        <Paper elevation={0} sx={{ p: '1rem', minWidth: '15rem' }}>
          <Typography variant="subtitle1" sx={{ color: 'grey.600', fontWeight: 'semiBold' }}>
            Total Corporates
          </Typography>
          <Stack direction="row">
            <Typography variant="h5" sx={{ fontWeight: 'semiBold' }}>
              {noOfCorporates}
            </Typography>

            <Stack
              direction="row"
              sx={{
                color:
                  corporatesPercentageChange > 0
                    ? 'success.main'
                    : corporatesPercentageChange > 0
                    ? 'error.main'
                    : 'grey.600',
                justifyContent: 'center',
                alignItems: 'center',
                ml: '0.5rem',
              }}
            >
              {corporatesPercentageChange > 0 && <ArrowCircleUpIcon fontSize="inherit" />}
              {corporatesPercentageChange < 0 && <ArrowCircleDownIcon fontSize="inherit" />}
              {corporatesPercentageChange === 0 && <RemoveCircleOutlineIcon fontSize="inherit" />}
              <Typography variant="body1" fontWeight="medium">
                {corporatesPercentageChange}%
              </Typography>
            </Stack>
          </Stack>
        </Paper>
        <Paper elevation={0} sx={{ p: '1rem', mx: '1rem', minWidth: '15rem' }}>
          <Typography variant="subtitle1" sx={{ color: 'grey.600', fontWeight: 'semiBold' }}>
            Total Corporate Students
          </Typography>
          <Stack direction="row">
            <Typography variant="h5" sx={{ fontWeight: 'semiBold' }}>
              {noOfStudents}
            </Typography>
          </Stack>
        </Paper>
        <Stack direction="column" sx={{ my: 'auto', ml: 'auto', color: 'grey.800' }} spacing={1}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            sx={{ bgcolor: 'grey.800', fontWeight: 'semiBold' }}
            onClick={() => setOpenAddCorp(true)}
          >
            Add Corporate
          </Button>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            sx={{ bgcolor: 'grey.800', fontWeight: 'semiBold' }}
            onClick={() => setOpen(true)}
          >
            Invite Students
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ mb: '2rem' }}>
        <CorpTable rows={corporates} title="Corporates" />
      </Box>
      <Modal
        open={openAddCorp}
        onClose={() => setOpenAddCorp(false)}
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
              Add Corporate
            </Typography>
            <Button
              onClick={() => setOpenAddCorp(false)}
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
            <form onSubmit={handleSubmit(submitAddCorp)}>
              <Stack direction="column" spacing={2}>
                <TextField
                  label="Corporate Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'name is required',
                    },
                  })}
                  error={errors.name}
                  helperText={errors.name && errors.name.message}
                />
                <TextField
                  label="Corporate Accounts Limit"
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  {...register('accountsLimit', {
                    required: {
                      value: true,
                      message: 'Accounts Limit is required',
                    },
                    min: {
                      value: 1,
                      message: 'Accounts Limit must be greater than 0',
                    },
                  })}
                  error={errors.accountsLimit}
                  helperText={errors.accountsLimit && errors.accountsLimit.message}
                />
                <TextField
                  label="Corporate Courses Limit"
                  variant="outlined"
                  size="small"
                  type="number"
                  fullWidth
                  {...register('coursesLimit', {
                    required: {
                      value: true,
                      message: 'Courses Limit is required',
                    },
                    min: {
                      value: 1,
                      message: 'Courses Limit must be greater than 0',
                    },
                  })}
                  error={errors.coursesLimit}
                  helperText={errors.coursesLimit && errors.coursesLimit.message}
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
                  Add
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Modal>
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
              Invite Students
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
            <Stack direction="column" spacing={2}>
              <ReactHookFormSelect
                id="corporate"
                name="corporate"
                label="Corporates"
                control={control}
                error={errorsInvite.corporate ? true : false}
                variant="outlined"
                margin="normal"
              >
                {corporates.map((corporate, i) => (
                  <MenuItem key={corporate._id} value={i}>
                    {corporate.name}
                  </MenuItem>
                ))}
              </ReactHookFormSelect>
              <Stack direction="row">
                <TextField
                  label="Student Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...registerCheck('email', {
                    required: {
                      value: true,
                      message: 'Student Email is required',
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errorsCheck.email}
                  helperText={errorsCheck.email && errorsCheck.email.message}
                />
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: 'grey.800',
                    color: 'grey.800',
                    fontWeight: 'semiBold',
                    height: '2.5rem',
                    ml: 1,
                    ':hover': {
                      borderColor: 'grey.800',
                    },
                  }}
                  onClick={handleSubmitCheck(submitCheck)}
                >
                  Add
                </Button>
              </Stack>
              <Stack>
                {emails.map((email, index) => (
                  <Stack direction="row" key={index} sx={{ mx: '1rem' }}>
                    <Typography>{email}</Typography>
                    <Button
                      sx={{
                        ml: 'auto',
                        minWidth: 0,
                        p: 0,
                      }}
                      onClick={() => handleRemoveEmail(email)}
                    >
                      <CloseIcon sx={{ color: 'error.main', fontSize: '1rem' }} />
                    </Button>
                  </Stack>
                ))}
              </Stack>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'grey.800',
                  color: 'white',
                  fontWeight: 'semiBold',
                }}
                onClick={handleSubmitInvite(submitInvite)}
              >
                Invite
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Main>
  );
}

export default Users;
