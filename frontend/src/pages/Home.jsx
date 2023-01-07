import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgURL from '../../public/assets/hero.png';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import { Container, Grid, Stack, Box, Button, Typography } from '@mui/material';

function Home() {
  const navigate = useNavigate();
  let user = useSelector((state) => state.user.user);
  typeof user === 'string' ? (user = JSON.parse(user)) : user;
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [topRatedCourses, setTopRatedCourses] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTrendingCourses = async () => {
      const res = await axios.get('/api/courses/trending');
      setTrendingCourses(res.data.slice(0, 4));
    };
    const fetchTopRatedCourses = async () => {
      const res = await axios.get('/api/courses/toprated');
      setTopRatedCourses(res.data.slice(0, 4));
    };
    fetchTrendingCourses();
    fetchTopRatedCourses();
  }, []);
  return (
    <>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: '1',
        }}
        maxWidth="md"
      >
        <Grid
          container
          sx={{
            flexGrow: '1',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Grid
            item
            sx={{
              alignSelf: 'center',
              px: { xs: '1rem' },
            }}
            md={7}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
              }}
            >
              Start Today
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'secondary.main',
                fontWeight: 'medium',
                textAlign: 'justify',
              }}
              mt={1}
            >
              Achive your goals with the world's best online learning platform{' '}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'grey.600',
                fontWeight: 'regular',
              }}
              mt={2}
            >
              Build skills with top instructors from leading organizations{' '}
            </Typography>
            {!user && (
              <Button variant="contained" sx={{ mt: 3, maxWidth: 'fit-content' }} href="/register">
                Get Started
              </Button>
            )}
          </Grid>
          <Grid
            item
            sx={{
              alignSelf: 'center',
            }}
            md={5}
          >
            <img src={imgURL} alt="hero" style={{ width: '100%' }} />
          </Grid>
        </Grid>
        <Box sx={{ my: '1rem' }}>
          <Stack direction="row" sx={{ my: '1rem' }}>
            <Typography variant="h4" sx={{ color: 'grey.800', fontWeight: 'semiBold' }}>
              Trending
            </Typography>
            <Button
              variant="outlined"
              sx={{
                ml: 'auto',
                color: 'grey.800',
                borderColor: 'grey.800',
                ':hover': { borderColor: 'grey.800' },
              }}
              onClick={() => navigate('/courses/trending')}
            >
              Show All
            </Button>
          </Stack>
          {trendingCourses.length === 0 ? (
            <Spinner />
          ) : (
            <Grid container spacing={2}>
              {trendingCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <Box sx={{ my: '1rem' }}>
          <Stack direction="row" sx={{ my: '1rem' }}>
            <Typography variant="h4" sx={{ color: 'grey.800', fontWeight: 'semiBold' }}>
              Top Rated
            </Typography>
            <Button
              variant="outlined"
              sx={{
                ml: 'auto',
                color: 'grey.800',
                borderColor: 'grey.800',
                ':hover': { borderColor: 'grey.800' },
              }}
              onClick={() => navigate('/courses/toprated')}
            >
              Show All
            </Button>
          </Stack>
          {trendingCourses.length === 0 ? (
            <Spinner />
          ) : (
            <Grid container spacing={2}>
              {topRatedCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
}

export default Home;
