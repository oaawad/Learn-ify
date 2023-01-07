import React from 'react';
import axios from 'axios';
import { Stack, Typography, Button, Box, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

function RevenueChart(props) {
  const [nextMonth, setNextMonth] = React.useState(null);
  const [thisMonth, setThisMonth] = React.useState('December, 2022');
  const [prevMonth, setPrevMonth] = React.useState('November, 2022');
  const [revenue, setRevenue] = React.useState(0);
  const [data, setData] = React.useState(null);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
  const getRevenuePerMonth = (month) => {
    axios
      .get('/api/users/instructor/revenue', {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
        params: {
          month: month,
        },
      })
      .then((res) => {
        setData({
          labels: res.data.labels,
          datasets: res.data.datasets,
        });
        setRevenue(res.data.revenue);
        setPrevMonth(res.data.prevMonth);
        setNextMonth(res.data.nextMonth);
        setThisMonth(res.data.thisMonth);
      });
  };

  React.useEffect(() => {
    getRevenuePerMonth('today');
  }, []);

  return (
    <Stack>
      <Stack direction="row" sx={{ mb: '1rem', alignItems: 'center' }}>
        <Button
          variant="outlined"
          sx={{
            mr: 'auto',
            border: 'hidden',
            ':hover': { border: 'hidden' },
            ':disabled': { border: 'hidden' },
            p: '0',
            visibility: prevMonth ? 'visible' : 'hidden',
            fontSize: '1rem',
            textTransform: 'none',
          }}
          onClick={() => getRevenuePerMonth(prevMonth)}
        >
          <ArrowBackIcon />
        </Button>
        <Typography variant="h6">{thisMonth}</Typography>
        <Button
          variant="outlined"
          sx={{
            ml: 'auto',
            border: 'hidden',
            ':hover': { border: 'hidden' },
            ':disabled': { border: 'hidden' },
            p: '0',
            visibility: nextMonth ? 'visible' : 'hidden',
          }}
          onClick={() => getRevenuePerMonth(nextMonth)}
        >
          <ArrowForwardIcon />
        </Button>
      </Stack>

      {revenue === 0 ? (
        <Typography variant="h6" sx={{ alignSelf: 'center' }}>
          No revenue this month
        </Typography>
      ) : (
        <Container maxWidth="md">
          <Typography variant="h6">Total revenue this month = {revenue}$</Typography>
          <Box>
            <Line options={options} data={data || { labels: [], datasets: [] }} />
          </Box>
        </Container>
      )}
    </Stack>
  );
}

export default RevenueChart;
