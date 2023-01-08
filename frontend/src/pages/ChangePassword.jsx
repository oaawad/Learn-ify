import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCountry } from '../features/user/userSlice';

import { toast } from 'react-toastify';
import countries from '../app/flags';
import {
  Button,
  TextField,
  Typography,
  Stack,
  Container,
  Box,
  Divider,
  InputAdornment,
  IconButton,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
} from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';
function ChangePassword() {
  let { user, country } = useSelector((state) => state.user);
  user = typeof user == 'string' ? JSON.parse(user) : user;
  country = typeof country == 'string' ? JSON.parse(country) : country;

  const [selected, setSelected] = useState('');
  const [empty, setEmpty] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleMouseDownOldPassword = () => setShowOldPassword(!showOldPassword);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);
  const [showPassword3, setShowPassword3] = useState(false);
  const handleClickShowPassword3 = () => setShowPassword3(!showPassword3);
  const handleMouseDownPassword3 = () => setShowPassword3(!showPassword3);
  const [password, setPassword] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue: setValue2,
  } = useForm();
  const options = countries;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onChangeCountry = async () => {
    if (selected === '') {
      setEmpty(true);
    } else {
      const data = { country: options[selected], token: user.token };
      dispatch(setCountry(data)).then((res) => {
        if (res.type === 'user/setCountry/fulfilled') {
          toast.success('Country Successfully Changed!');
          setSelected('');
        }
      });
    }
  };

  const changePassword = async (userData) => {
    await axios
      .patch(`/api/users/changePass`, userData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        toast.success('Password Successfully Changed!');
        setValue('oldPassword', '');
        setValue('password', '');
        setValue('password2', '');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const changeEmail = async (userData) => {
    await axios
      .patch(`/api/users/changeEmail`, userData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        toast.success('Email Successfully Changed!');
        setEmail(userData.email);
        setValue2('email', '');
        setValue2('password', '');
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const onSubmit = (data) => {
    if (data.password !== data.password2) {
      setError('passMiss', {
        type: 'custom',
        message: 'Passwords do not match',
      });
    } else {
      changePassword(data);
    }
  };
  const onSubmitEmail = (data) => {
    changeEmail(data);
  };

  const getEmail = async () => {
    await axios.get(`/api/users/${user._id}`).then((res) => {
      setEmail(res.data);
    });
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      if (country) {
        const index = options.findIndex((option) => option.name === country.name);
        setSelected(index);
      }
      getEmail();
    }
  }, []);
  return (
    <Box sx={{ backgroundColor: 'white', paddingBottom: '2rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          maxWidth: '100%',
          height: '30vh',
          backgroundColor: 'secondary.main',
          marginBottom: '2rem',
        }}
      >
        <Typography variant="h4" color="WHITE">
          Account Settings
        </Typography>
      </Box>
      <Container maxWidth="lg">
        <Box>
          <Typography variant="h5" color="text.primary">
            Country
          </Typography>
          <Stack alignItems="center" justifyContent="center">
            <Stack direction="row" sx={{ p: '1rem', width: '50%', alignItems: 'center' }}>
              <FormControl sx={{ width: '70%' }}>
                <InputLabel id="demo-simple-select-label" size="small">
                  Select your country
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selected}
                  label="Select your country"
                  onChange={(event) => {
                    setSelected(event.target.value);
                  }}
                  sx={{
                    '& .MuiSelect-select': { backgroundColor: 'grey.300' },
                    borderColor: empty ? 'error.main' : 'grey.700',
                  }}
                  size="small"
                >
                  {options.map((option, i) => (
                    <MenuItem key={i} value={i}>
                      <Stack direction="row">
                        <Avatar
                          src={`data:image/png;base64, ${option.flag}`}
                          sx={{ width: 20, height: 20, marginRight: '1rem' }}
                        />
                        <Typography variant="body2">{option.name}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                sx={{ marginLeft: 'auto' }}
                onClick={() => onChangeCountry()}
              >
                Change
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Divider sx={{ marginBottom: '2rem' }} />
        <Box>
          <Typography variant="h5" color="text.primary">
            Email
          </Typography>
          <Stack alignItems="center" justifyContent="center">
            <Stack direction="row" sx={{ p: '1rem', width: '50%', alignItems: 'center' }}>
              <Typography variant="body1" color="text.primary">
                Your current email is{' '}
                <Typography variant="oveline" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  {email}
                </Typography>
              </Typography>
              <Button sx={{ marginLeft: 'auto' }} onClick={() => setOpen(true)}>
                <EditOutlined />
              </Button>
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
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <form onSubmit={handleSubmit2(onSubmitEmail)}>
                    <Typography variant="h5" color="text.primary">
                      Change Email
                    </Typography>
                    <Stack direction="column" sx={{ p: '1rem', width: '100%' }}>
                      <TextField
                        name="email"
                        type="text"
                        label="New Email"
                        variant="outlined"
                        {...register2('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        error={errors2?.email ? true : false}
                        helperText={errors2?.email && errors2.email.message}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Password"
                        variant="outlined"
                        type={showPassword3 ? 'text' : 'password'}
                        sx={{ marginTop: '1rem' }}
                        size="small"
                        {...register2('password', { required: true })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword3}
                                onMouseDown={handleMouseDownPassword3}
                                edge="end"
                              >
                                {showPassword3 ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button type="submit" variant="contained" sx={{ marginTop: '1rem' }}>
                        Submit
                      </Button>
                    </Stack>
                  </form>
                </Box>
              </Modal>
            </Stack>
          </Stack>
        </Box>
        <Divider sx={{ marginBottom: '2rem' }} />
        <Box>
          <Typography variant="h5" color="text.primary">
            Change Password
          </Typography>
          <Stack alignItems="center" justifyContent="center">
            <Stack direction="row" sx={{ p: '1rem', width: '50%', alignItems: 'center' }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  type={showOldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  label="Old Password"
                  variant="outlined"
                  {...register('oldPassword', {
                    required: 'Old Password is required',
                  })}
                  error={errors?.oldPassword ? true : false}
                  helperText={errors?.oldPassword && errors.oldPassword.message}
                  fullWidth
                  sx={{ marginTop: '1rem' }}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowOldPassword}
                          onMouseDown={handleMouseDownOldPassword}
                        >
                          {showOldPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label="Password"
                  variant="outlined"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    onChange: (e) => setPassword(e.target.value),
                  })}
                  error={errors?.password || errors?.passMiss ? true : false}
                  helperText={errors?.password && errors.password.message}
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
                  {...register('password2', {
                    required: 'Confirm Password is required',
                    onChange: (e) => {
                      if (e.target.value === password) {
                        clearErrors('passMiss');
                      }
                    },
                  })}
                  error={errors?.passMiss || errors?.password2 ? true : false}
                  helperText={
                    (errors?.password2 && errors.password2.message) ||
                    (errors?.passMiss && errors.passMiss.message)
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
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ marginTop: '0.5rem' }}
                  color="secondary"
                >
                  Submit
                </Button>
              </form>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default ChangePassword;
