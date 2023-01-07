import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';

import ReportCard from '../components/ReportCard';

import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Divider,
  Button,
  Chip,
  Grid,
  TextField,
} from '@mui/material';
import Reviews from '../components/Reviews';
import axios from 'axios';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ReviewForm from '../components/ReviewForm';
function Support(props) {
  let { user } = useSelector((state) => state.user);
  if (typeof user === 'string') {
    user = JSON.parse(user);
  }

  const {
    handleSubmit,
    formState: { errors },
    setError,
    userid,
  } = useForm();
  const [tickets, setTickets] = useState([]);
  const [unresolved, setUnresolved] = useState([]);
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`/api/ticket/my-tickets/`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setTickets(res.data);
      });

    axios
      .get(`/api/ticket/my-tickets/unresolved`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setUnresolved(res.data);
      });
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
          Customer Support
        </Typography>
        <Breadcrumbs separator="›" color="grey.600">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="white">Support</Typography>
        </Breadcrumbs>
      </Box>
      {user ? (
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <form>
              <Stack direction="row">
                <Stack sx={{ marginLeft: '1rem', justifyContent: 'center' }}>
                  <Stack direction="row" alignItems="center">
                    <Stack>
                      <>
                        <Typography variant="h5" color="grey.800" fontWeight="semiBold">
                          Reports
                        </Typography>
                      </>
                    </Stack>
                  </Stack>
                  <Stack direction="row" mt="0.7rem">
                    <Typography
                      variant="body2"
                      color="grey.600"
                      sx={{
                        pr: '1rem',
                        alignSelf: 'center',
                      }}
                    >
                      <Typography
                        variant="oveline"
                        color="grey.600"
                        fontWeight="bold"
                        fontSize="inherit"
                      >
                        {tickets?.length}
                      </Typography>
                      {'  '} Reports
                    </Typography>
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{
                        pr: '1rem',
                        alignSelf: 'center',
                      }}
                    >
                      <Typography variant="oveline" color="error" fontWeight="bold">
                        {unresolved?.length}
                      </Typography>
                      {'  '}Unresolved Reports
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </form>
          </Box>
          <Stack direction="row" sx={{ mt: '1rem' }}>
            <Button
              sx={{
                paddingY: '1rem',
                color: tab === 1 ? 'primary.main' : 'grey.600',
                borderRadius: '0',
                borderBottom: tab === 1 ? '2px solid' : 'none',
                borderColor: 'primary.main',
              }}
              onClick={() => setTab(1)}
            >
              All Reports
            </Button>
            <Button
              sx={{
                paddingY: '1rem ',
                color: tab === 3 ? 'primary.main' : 'grey.600',
                borderRadius: '0',
                borderBottom: tab === 2 ? '2px solid' : 'none',
                borderColor: tab === 2 ? 'primary.main' : 'none',
              }}
              onClick={() => setTab(2)}
            >
              Unresolved Reports
            </Button>
          </Stack>

          <Divider />

          {tab == 1 ? (
            <Box
              sx={{
                width: '100%',
                mt: '1rem',
              }}
            >
              <Stack
                direction="column"
                divider={<Divider orientation="horizontal" flexItem />}
                spacing={2}
              >
                <Box sx={{ mt: '1rem' }}>
                  {tickets.length > 0 &&
                    tickets.map((ticket, i) => {
                      return (
                        <ReportCard
                          user={user}
                          key={i}
                          report={ticket}
                          sx={{
                            height: '100%',
                            mt: '1rem',
                          }}
                        ></ReportCard>
                      );
                    })}
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                mt: '1rem',
              }}
            >
              <Stack
                direction="column"
                divider={<Divider orientation="horizontal" flexItem />}
                spacing={2}
              >
                <Box sx={{ mt: '1rem' }}>
                  {unresolved.length > 0 &&
                    unresolved.map((ticket, i) => {
                      return (
                        <ReportCard
                          key={i}
                          report={ticket}
                          sx={{
                            height: '100%',
                            mt: '1rem',
                          }}
                        ></ReportCard>
                      );
                    })}
                </Box>
              </Stack>
            </Box>
          )}
        </Container>
      ) : (
        <Spinner />
      )}
    </Box>
  );
}

export default Support;
