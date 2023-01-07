import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Box, Container, Typography, Breadcrumbs, Link, Stack } from '@mui/material';
import PaymentsTable from '../components/PaymentsTable';
import Spinner from '../components/Spinner';

function PaymentsHistory() {
  const [payments, setPayments] = React.useState([]);
  const [refundRequests, setRefundRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  let { user } = useSelector((state) => state.user);
  user = typeof user === 'string' ? JSON.parse(user) : user;
  React.useEffect(() => {
    axios
      .get('/api/payment/me', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setPayments(res.data);
        setLoading(false);
      });
    axios
      .get('/api/ticket/myRefund', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setRefundRequests(res.data);
      });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          maxWidth: '100%',
          height: '30vh',
          backgroundColor: 'secondary.main',
          position: 'relative',
        }}
      >
        <Typography variant="h4" color="WHITE">
          Payments History
        </Typography>
        <Breadcrumbs separator="›" color="grey.600">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="white">Payments</Typography>
        </Breadcrumbs>
        <Stack
          sx={{
            position: { sx: 'fixed', sm: 'absolute' },
            top: '4.2rem',
            right: '3rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" color="white">
            My Wallet
          </Typography>
          <Typography variant="h5" color="white">
            {user.wallet || 0}.00 $
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ bgcolor: 'grey.300', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              flexGrow: 1,
              marginTop: '2rem',
            }}
          >
            {loading ? (
              <Spinner />
            ) : payments.lenght === 0 ? (
              <Typography variant="h4" color="grey.700">
                No Payments History
              </Typography>
            ) : (
              <Stack spacing={2} direction="column">
                <PaymentsTable rows={payments} title={'My Payments'} />
                <PaymentsTable rows={refundRequests} title={'Refund Requests'} />
              </Stack>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default PaymentsHistory;
