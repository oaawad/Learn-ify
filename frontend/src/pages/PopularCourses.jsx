import { Box, Typography, Breadcrumbs, Grid, Link, Container } from '@mui/material';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useEffect, useState } from 'react';

function PopularCourses(props) {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (props.trending) {
      axios.get('/api/courses/trending').then((res) => {
        setCourses(res.data);
      });
    } else {
      axios.get('/api/courses/toprated').then((res) => {
        setCourses(res.data);
      });
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
          {props.trending ? 'Trending' : 'Top Rated'} Courses
        </Typography>
        <Breadcrumbs separator="›" color="grey.600">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/courses">
            Courses
          </Link>
          <Typography color="white">{props.trending ? 'Trending' : 'Top Rated'}</Typography>
        </Breadcrumbs>
      </Box>
      <Container maxWidth="lg">
        {courses.length === 0 ? (
          <Spinner />
        ) : (
          <Grid container spacing={2}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default PopularCourses;
