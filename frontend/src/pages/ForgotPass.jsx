import { useNavigate } from 'react-router-dom';
import imgURL from '../../public/assets/join.jpg';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Box, Grid, Typography, TextField, Button } from '@mui/material';

const API_URL = 'http://localhost:5555/api/users/';

function ForgotPass() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const sendMail = async (data) => {
    const response = await axios
      .post(`/api/users/forgotPass`, data)
      .then((response) => {
        toast.success('Please check your email for further instructions');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const onSubmit = (data) => {
    sendMail(data);
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
                type="text"
                name="email"
                autoComplete="email"
                autoFocus
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                {...register('email', {
                  required: 'You have to enter your email',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors?.email ? true : false}
                helperText={errors?.email && errors.email.message}
                InputLabelProps={{
                  shrink: true,
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

export default ForgotPass;
