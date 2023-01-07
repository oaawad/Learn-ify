import { useState } from 'react';
import imgURL from '../../public/assets/join.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2(!showPassword2);
  const handleMouseDownPassword2 = () => setShowPassword2(!showPassword2);
  const [password, setPassword] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const { token, email } = useParams();

  let { user } = useSelector((state) => state.user);

  if (typeof user == 'string') {
    user = JSON.parse(user);
  }

  const navigate = useNavigate();
  const resetPassword = async (userData) => {
    await axios
      .patch(`/api/users/resetPass/${token}/${email}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success('Password Successfully Changed!');
        navigate('/login');
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
      resetPassword(data);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ marginTop: '3rem' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} display={{ xs: 'none', sm: 'block' }}>
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
        <Grid item xs={12} sm={6} display="flex" justifyContent="center" alignItems="center">
          <Box width="60%">
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              mb={4}
              color="secondary.main"
            >
              Reset Password
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
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
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ResetPassword;
