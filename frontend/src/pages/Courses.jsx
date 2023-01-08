import CourseGallery from '../components/CourseGallery';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { Container, Box, Typography, Breadcrumbs, Link, Pagination } from '@mui/material';
function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get('/api/courses').then((res) => {
      setCourses(res.data);
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
          All Courses
        </Typography>
        <Breadcrumbs separator="›" color="grey.600">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="white">Courses</Typography>
        </Breadcrumbs>
      </Box>
      <Container maxWidth="lg">
        {courses.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              maxWidth: '100%',
              height: '40vh',
            }}
          >
            <Spinner />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              maxWidth: '100%',
              height: 'auto',
            }}
          >
            <CourseGallery courses={courses} noFilters={false} />
            <Pagination sx={{ mt: '2rem' }} count={1} shape="rounded" />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Courses;
