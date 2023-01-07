import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/user/userSlice';
import Spinner from '../components/Spinner';
import imgURL from '../../public/assets/join.jpg';
import { useForm } from 'react-hook-form';

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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (isError) {
      setError('login', { type: 'custom', message: message });
    }

    if (isSuccess || user) {
      if (user.type === 'administrator') {
        navigate('/dashboard');
      } else if (user.type === 'instructor') {
        navigate(`/profile`);
      } else {
        navigate('/');
      }
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ display: 'flex', marginTop: '3rem', flexGrow: '1' }}
    >
      <Grid container sx={{ flexGrow: '1' }}>
        <Grid item xs={12} sm={6} display={{ xs: 'none', sm: 'flex' }}>
          <Box
            sx={{
              alignSelf: 'center',
              maxWidth: '500px',
              width: { xs: '80%', md: '100%' },
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
              mb={4}
              color="secondary.main"
            >
              Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                type="text"
                name="username"
                autoComplete="username"
                autoFocus
                label="Username"
                variant="outlined"
                fullWidth
                size="small"
                {...register(
                  'username',
                  {
                    onChange: (e) => {
                      clearErrors('login');
                    },
                  },
                  { required: true }
                )}
                error={errors?.username || errors?.login ? true : false}
                helperText={errors?.username && 'Username is required'}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                sx={{ marginTop: '1rem' }}
                size="small"
                {...register(
                  'password',
                  {
                    onChange: (e) => {
                      clearErrors('login');
                    },
                  },
                  { required: 'Password is required' }
                )}
                error={errors?.password || errors?.login ? true : false}
                helperText={
                  (errors?.password ? errors.password.message : null) ||
                  (errors?.login ? errors.login.message : null)
                }
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
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
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Stay Logged in"
                  sx={{ marginTop: '0.5rem' }}
                />
              </FormGroup>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginTop: '0.5rem' }}
                color="secondary"
              >
                Login
              </Button>
            </form>
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ marginTop: '1rem' }}
            >
              Don't have an account?{' '}
              <Link sx={{ textDecoration: 'none' }} href="/register">
                Register
              </Link>
            </Typography>
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ marginTop: '1rem' }}
            >
              Forgot password?{' '}
              <Link sx={{ textDecoration: 'none' }} href="/forgot-password">
                Reset
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
