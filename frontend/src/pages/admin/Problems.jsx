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
import ProblemsTable from './ProblemsTable';
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

function Problems(props) {
  const theme = useTheme();
  const [problems, setProblems] = React.useState([]);
  const [noOfProblems, setNoOfProblems] = React.useState(0);
  const [openProblem, setOpenProblem] = React.useState(false);

  React.useEffect(() => {
    if (props.user) {
      axios
        .get('/api/ticket', {
          headers: {
            Authorization: 'Bearer ' + props.user.token,
          },
        })
        .then((response) => {
          setProblems(response.data.problems);
          setNoOfProblems(response.data.problems.length);
        });
    }
  }, []);

  return (
    <Main
      open={props.open}
      sx={{
        bgcolor: 'grey.400',
        flexGrow: 1,
        display: props.active === 'Problems' ? 'block' : 'none',
      }}
    >
      <DrawerHeader />

      <Stack direction="row" sx={{ mb: '2rem' }}>
        <Paper elevation={0} sx={{ p: '1rem', minWidth: '15rem' }}>
          <Typography variant="subtitle1" sx={{ color: 'grey.600', fontWeight: 'semiBold' }}>
            Total Problems
          </Typography>
          <Stack direction="row">
            <Typography variant="h5" sx={{ fontWeight: 'semiBold' }}>
              {noOfProblems}
            </Typography>
          </Stack>
        </Paper>
      </Stack>
      <Box sx={{ mb: '2rem' }}>
        <ProblemsTable rows={problems} title="Problems" token={props.user.token} />
      </Box>
      {/* <Modal
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
      </Modal> */}
    </Main>
  );
}

export default Problems;
