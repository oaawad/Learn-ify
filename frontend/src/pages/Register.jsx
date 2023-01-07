import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { register as signup, reset } from '../features/user/userSlice';
import Spinner from '../components/Spinner';
import imgURL from '../../public/assets/join.jpg';
import { useForm } from 'react-hook-form';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Container,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
function Register(props) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.user);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (isError) {
      //to do:  error message
    }

    if (isSuccess || user) {
      navigate('/');
    }
  }, [user, isError, isSuccess, message, navigate]);

  const onSubmit = (data) => {
    if (data.password !== data.password2) {
      setError('passMiss', {
        type: 'custom',
        message: 'Passwords do not match',
      });
    } else {
      if (props.comp) {
        dispatch(signup({ data, token, comp: props.comp }));
      } else if (props.corp) {
        dispatch(signup({ data, token, corp: props.corp }));
      } else {
        dispatch(signup(data));
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', marginTop: '3rem', flexGrow: '1' }}>
      <Grid container sx={{ flexGrow: '1' }}>
        <Grid item xs={12} sm={6} display={{ xs: 'none', sm: 'flex' }}>
          <Box
            sx={{
              alignSelf: 'center',
              maxWidth: '500px',
              width: { xs: '80%', sm: '100%' },
            }}
          >
            <img src={imgURL} alt="hero" style={{ width: '100%' }} />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginBottom={2}
        >
          <Box width="60%">
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              mb={2}
              color="secondary.main"
            >
              {props.comp ? 'Complete Registration' : 'Sign up'}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                type="text"
                name="firstName"
                label="First Name"
                variant="outlined"
                {...register('firstName', {
                  required: 'First Name is required',
                })}
                error={errors?.firstName ? true : false}
                helperText={errors?.firstName && errors.firstName.message}
                fullWidth
                sx={{ marginTop: '1rem' }}
                size="small"
              />
              <TextField
                type="text"
                name="lastName"
                label="Last Name"
                variant="outlined"
                {...register('lastName', { required: 'Last Name is required' })}
                error={errors?.lastName ? true : false}
                helperText={errors?.lastName && errors.lastName.message}
                fullWidth
                sx={{ marginTop: '1rem' }}
                size="small"
              />
              <TextField
                type="text"
                name="username"
                label="Username"
                variant="outlined"
                {...register('username', { required: 'Username is required' })}
                error={errors?.username ? true : false}
                helperText={errors?.username && errors.username.message}
                fullWidth
                sx={{ marginTop: '1rem' }}
                size="small"
              />
              {!props.comp && !props.corp && (
                <TextField
                  type="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={errors?.email ? true : false}
                  helperText={errors?.email && errors.email.message}
                  fullWidth
                  sx={{ marginTop: '1rem' }}
                  size="small"
                />
              )}
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
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox sx={{ color: errors?.terms ? 'error.main' : 'black' }} />}
                  label="Accept Terms and Conditions"
                  sx={{
                    marginTop: '0.5rem',
                    color: errors?.terms ? 'error.main' : 'black',
                  }}
                  name="terms"
                  {...register('terms', {
                    required: 'You must accept the terms and conditions',
                  })}
                />
              </FormGroup>
              {errors?.terms && (
                <Stack direction="row" justifyContent="center" mt={1}>
                  <ErrorOutlineIcon
                    sx={{ color: 'error.main', marginRight: '0.5rem' }}
                    fontSize="small"
                  />
                  <Typography variant="body2" color="error.main">
                    You must accept the terms and conditions
                  </Typography>
                </Stack>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginTop: '0.5rem' }}
                color="secondary"
              >
                Sign up
              </Button>
            </form>
            {!props.comp && (
              <Typography variant="body2" textAlign="center" sx={{ marginTop: '1rem' }}>
                Already have an account?{' '}
                <Link sx={{ textDecoration: 'none' }} href="/login">
                  Login
                </Link>
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Register;
